import os
import re
from datetime import datetime
from flask import Flask, request, jsonify, render_template, send_from_directory
from werkzeug.utils import secure_filename
from database import get_db, init_db, seed_data
from auth import (
    hash_password, verify_password, generate_token,
    get_user_from_token, delete_token, token_required,
    admin_required, optional_user
)

app = Flask(__name__, template_folder='templates', static_folder='static')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max upload
UPLOAD_FOLDER = os.path.join(app.static_folder, 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

CATEGORIES = [
    "Books",
    "Notes & Study Material",
    "Electronics",
    "Calculators",
    "Lab Equipment",
    "Stationery",
    "Hostel Items",
    "Bags & Accessories",
    "College Uniform",
    "Other"
]

CONDITIONS = ["Brand New", "Like New", "Good", "Fair"]

# Ensure DB is initialized
init_db()
seed_data()

# ----------------- HTML PAGE ROUTE -----------------
@app.route('/')
def index():
    return render_template('index.html')

# ----------------- AUTH ROUTES -----------------
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    confirm_password = data.get('confirm_password') or ''
    department = (data.get('department') or '').strip()
    year = (data.get('year') or '').strip()
    phone = (data.get('phone') or '').strip()

    # Validation
    if not name:
        return jsonify({'error': 'Full name is required.'}), 400
    if not email:
        return jsonify({'error': 'College email is required.'}), 400
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({'error': 'Invalid email address format.'}), 400
    if not department:
        return jsonify({'error': 'Department / Branch is required.'}), 400
    if not year:
        return jsonify({'error': 'Year / Semester is required.'}), 400
    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters long.'}), 400
    if password != confirm_password:
        return jsonify({'error': 'Passwords do not match.'}), 400

    conn = get_db()
    cursor = conn.cursor()

    # Check if email already taken
    cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
    if cursor.fetchone():
        conn.close()
        return jsonify({'error': 'An account with this email already exists.'}), 400

    pw_hash = hash_password(password)
    # Default avatar based on name initials
    avatar_url = f"/static/images/avatars/student.svg"

    cursor.execute("""
        INSERT INTO users (name, email, password_hash, department, year, role, status, phone, avatar_url)
        VALUES (?, ?, ?, ?, ?, 'student', 'active', ?, ?)
    """, (name, email, pw_hash, department, year, phone, avatar_url))
    user_id = cursor.lastrowid
    conn.commit()
    conn.close()

    token = generate_token(user_id)
    user = {
        'id': user_id,
        'name': name,
        'email': email,
        'department': department,
        'year': year,
        'role': 'student',
        'status': 'active',
        'phone': phone,
        'avatar_url': avatar_url
    }

    return jsonify({
        'message': 'Registration successful! Welcome to CampusMart.',
        'token': token,
        'user': user
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not email or not password:
        return jsonify({'error': 'Please enter both email and password.'}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, name, email, password_hash, department, year, role, status, phone, avatar_url
        FROM users WHERE email = ?
    """, (email,))
    row = cursor.fetchone()
    conn.close()

    if not row or not verify_password(password, row['password_hash']):
        return jsonify({'error': 'Invalid college email or password.'}), 401

    if row['status'] == 'suspended':
        return jsonify({'error': 'Your student account has been suspended by campus administration.'}), 403

    if row['role'] == 'admin':
        return jsonify({'error': 'Administrator accounts must use the dedicated Admin Login portal.'}), 403

    token = generate_token(row['id'])
    user = {
        'id': row['id'],
        'name': row['name'],
        'email': row['email'],
        'department': row['department'],
        'year': row['year'],
        'role': row['role'],
        'status': row['status'],
        'phone': row['phone'],
        'avatar_url': row['avatar_url']
    }

    return jsonify({
        'message': 'Login successful!',
        'token': token,
        'user': user
    }), 200

@app.route('/api/auth/admin-login', methods=['POST'])
def admin_login():
    data = request.get_json() or {}
    login_id = (data.get('login_id') or data.get('username') or '').strip()
    password = data.get('password') or ''

    # Fixed admin credentials: Login ID: admin, Password: admin
    if login_id != 'admin' or password != 'admin':
        return jsonify({'error': 'Invalid admin credentials'}), 401

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, department, year, role, status, phone, avatar_url FROM users WHERE role = 'admin' LIMIT 1")
    admin_row = cursor.fetchone()

    if not admin_row:
        # Create default admin user if not present
        cursor.execute("""
            INSERT INTO users (name, email, password_hash, department, year, role, status, phone, avatar_url)
            VALUES ('Campus Administrator', 'admin@campusmart.edu', ?, 'Administration', 'Staff', 'admin', 'active', '+91 98765 00000', '/static/images/avatars/admin.svg')
        """, (hash_password('admin'),))
        admin_id = cursor.lastrowid
        conn.commit()
        cursor.execute("SELECT id, name, email, department, year, role, status, phone, avatar_url FROM users WHERE id = ?", (admin_id,))
        admin_row = cursor.fetchone()

    conn.close()

    admin_user = dict(admin_row)
    token = generate_token(admin_user['id'])

    return jsonify({
        'message': 'Admin authentication successful!',
        'token': token,
        'user': admin_user
    }), 200

@app.route('/api/auth/logout', methods=['POST'])
@token_required
def logout(current_user):
    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Bearer '):
        token = auth_header[7:].strip()
        delete_token(token)
    return jsonify({'message': 'Logged out successfully.'}), 200

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user_profile(current_user):
    conn = get_db()
    cursor = conn.cursor()

    # Total listings count
    cursor.execute("SELECT COUNT(*) as count FROM products WHERE seller_id = ?", (current_user['id'],))
    total_listings = cursor.fetchone()['count']

    # Sold listings count
    cursor.execute("SELECT COUNT(*) as count FROM products WHERE seller_id = ? AND status = 'sold'", (current_user['id'],))
    sold_listings = cursor.fetchone()['count']

    # Active listings count
    cursor.execute("SELECT COUNT(*) as count FROM products WHERE seller_id = ? AND status = 'active'", (current_user['id'],))
    active_listings = cursor.fetchone()['count']

    # Wishlist count
    cursor.execute("SELECT COUNT(*) as count FROM wishlist WHERE user_id = ?", (current_user['id'],))
    wishlist_count = cursor.fetchone()['count']

    # Unread messages count
    cursor.execute("SELECT COUNT(*) as count FROM messages WHERE receiver_id = ? AND is_read = 0", (current_user['id'],))
    unread_messages = cursor.fetchone()['count']

    conn.close()

    user_data = dict(current_user)
    user_data['stats'] = {
        'total_listings': total_listings,
        'sold_listings': sold_listings,
        'active_listings': active_listings,
        'wishlist_count': wishlist_count,
        'unread_messages': unread_messages
    }
    return jsonify(user_data)

@app.route('/api/auth/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    department = (data.get('department') or '').strip()
    year = (data.get('year') or '').strip()
    phone = (data.get('phone') or '').strip()

    if not name or not department or not year:
        return jsonify({'error': 'Name, department, and year are required.'}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE users
        SET name = ?, department = ?, year = ?, phone = ?
        WHERE id = ?
    """, (name, department, year, phone, current_user['id']))
    conn.commit()
    conn.close()

    updated = dict(current_user)
    updated['name'] = name
    updated['department'] = department
    updated['year'] = year
    updated['phone'] = phone

    return jsonify({'message': 'Profile updated successfully!', 'user': updated})

@app.route('/api/auth/demo-users', methods=['GET'])
def get_demo_users():
    return jsonify([
        {
            'label': 'Rahul Sharma (Student - CS 3rd Yr)',
            'email': 'rahul@campusmart.edu',
            'password': 'student123',
            'role': 'student'
        },
        {
            'label': 'Priya Patel (Student - EE 2nd Yr)',
            'email': 'priya@campusmart.edu',
            'password': 'student123',
            'role': 'student'
        },
        {
            'label': 'Rohan Verma (Student - ME 4th Yr)',
            'email': 'rohan@campusmart.edu',
            'password': 'student123',
            'role': 'student'
        },
        {
            'label': 'Campus Administrator (Staff)',
            'email': 'admin@campusmart.edu',
            'password': 'admin123',
            'role': 'admin'
        }
    ])

# ----------------- CATEGORIES ROUTE -----------------
@app.route('/api/categories', methods=['GET'])
def get_categories():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT category, COUNT(*) as active_count
        FROM products
        WHERE status = 'active'
        GROUP BY category
    """)
    counts = {row['category']: row['active_count'] for row in cursor.fetchall()}
    conn.close()

    result = []
    for cat in CATEGORIES:
        result.append({
            'name': cat,
            'count': counts.get(cat, 0)
        })
    return jsonify(result)

# ----------------- PRODUCTS ROUTES -----------------
@app.route('/api/products', methods=['GET'])
@optional_user
def get_products(current_user):
    conn = get_db()
    cursor = conn.cursor()

    q = (request.args.get('q') or '').strip()
    category = (request.args.get('category') or '').strip()
    condition = (request.args.get('condition') or '').strip()
    min_price = request.args.get('min_price')
    max_price = request.args.get('max_price')
    seller_id = request.args.get('seller_id')
    status = request.args.get('status')
    sort_by = request.args.get('sort_by') or 'newest'
    limit = int(request.args.get('limit') or 50)
    offset = int(request.args.get('offset') or 0)

    query = """
        SELECT p.*, u.name as seller_name, u.department as seller_department,
               u.year as seller_year, u.email as seller_email, u.phone as seller_phone
        FROM products p
        JOIN users u ON p.seller_id = u.id
        WHERE 1=1
    """
    params = []

    # Status filter: default to 'active' if not specified or unless filtering by seller or admin
    if status and status != 'all':
        query += " AND p.status = ?"
        params.append(status)
    elif not seller_id:
        # On public marketplace, show active and sold (with sold badge), but hide removed
        query += " AND p.status != 'removed'"
    else:
        query += " AND p.status != 'removed'"

    if seller_id:
        query += " AND p.seller_id = ?"
        params.append(int(seller_id))

    if category and category != 'All':
        query += " AND p.category = ?"
        params.append(category)

    if condition and condition != 'All':
        query += " AND p.condition = ?"
        params.append(condition)

    if min_price:
        try:
            query += " AND p.price >= ?"
            params.append(float(min_price))
        except ValueError:
            pass

    if max_price:
        try:
            query += " AND p.price <= ?"
            params.append(float(max_price))
        except ValueError:
            pass

    if q:
        query += """ AND (
            p.title LIKE ? OR
            p.description LIKE ? OR
            p.category LIKE ? OR
            p.location LIKE ? OR
            p.brand LIKE ? OR
            u.name LIKE ?
        )"""
        search_pattern = f"%{q}%"
        params.extend([search_pattern] * 6)

    # Sorting
    if sort_by == 'price_asc':
        query += " ORDER BY p.price ASC, p.created_at DESC"
    elif sort_by == 'price_desc':
        query += " ORDER BY p.price DESC, p.created_at DESC"
    elif sort_by == 'oldest':
        query += " ORDER BY p.created_at ASC"
    else:
        # Default newest
        query += " ORDER BY p.created_at DESC"

    query += " LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    cursor.execute(query, params)
    rows = cursor.fetchall()

    # Check wishlisted items for current user
    wishlist_set = set()
    if current_user:
        cursor.execute("SELECT product_id FROM wishlist WHERE user_id = ?", (current_user['id'],))
        wishlist_set = {row['product_id'] for row in cursor.fetchall()}

    conn.close()

    products = []
    for row in rows:
        p = dict(row)
        p['is_wishlisted'] = p['id'] in wishlist_set
        products.append(p)

    return jsonify(products)

@app.route('/api/products/<int:product_id>', methods=['GET'])
@optional_user
def get_product_details(current_user, product_id):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT p.*, u.name as seller_name, u.email as seller_email,
               u.department as seller_department, u.year as seller_year,
               u.phone as seller_phone, u.avatar_url as seller_avatar,
               u.created_at as seller_joined_at
        FROM products p
        JOIN users u ON p.seller_id = u.id
        WHERE p.id = ?
    """, (product_id,))
    row = cursor.fetchone()

    if not row:
        conn.close()
        return jsonify({'error': 'Product listing not found.'}), 404

    product = dict(row)

    # Seller statistics
    cursor.execute("""
        SELECT 
            COUNT(*) as total_listings,
            SUM(CASE WHEN status = 'sold' THEN 1 ELSE 0 END) as sold_count
        FROM products WHERE seller_id = ?
    """, (product['seller_id'],))
    seller_stats = cursor.fetchone()
    product['seller_stats'] = {
        'total_listings': seller_stats['total_listings'] or 0,
        'sold_listings': seller_stats['sold_count'] or 0
    }

    # Wishlist status for current user
    product['is_wishlisted'] = False
    product['is_reported'] = False
    if current_user:
        cursor.execute("SELECT 1 FROM wishlist WHERE user_id = ? AND product_id = ?", (current_user['id'], product_id))
        product['is_wishlisted'] = cursor.fetchone() is not None

        cursor.execute("SELECT 1 FROM reports WHERE reporter_id = ? AND product_id = ?", (current_user['id'], product_id))
        product['is_reported'] = cursor.fetchone() is not None

    # Similar products in same category
    cursor.execute("""
        SELECT id, title, price, condition, category, image_url, location, status
        FROM products
        WHERE category = ? AND id != ? AND status = 'active'
        LIMIT 4
    """, (product['category'], product_id))
    similar = [dict(r) for r in cursor.fetchall()]
    product['similar_products'] = similar

    conn.close()
    return jsonify(product)

@app.route('/api/products', methods=['POST'])
@token_required
def create_product(current_user):
    data = request.get_json() or {}
    title = (data.get('title') or '').strip()
    category = (data.get('category') or '').strip()
    description = (data.get('description') or '').strip()
    price_val = data.get('price')
    condition = (data.get('condition') or '').strip()
    image_url = (data.get('image_url') or '').strip()
    location = (data.get('location') or '').strip()
    brand = (data.get('brand') or '').strip()
    contact_pref = (data.get('contact_pref') or 'Chat').strip()

    # Validation
    if not title:
        return jsonify({'error': 'Product title is required.'}), 400
    if not category or category not in CATEGORIES:
        return jsonify({'error': f'Valid category is required ({", ".join(CATEGORIES)}).' }), 400
    if not description:
        return jsonify({'error': 'Product description is required.'}), 400
    if not condition or condition not in CONDITIONS:
        return jsonify({'error': f'Condition must be one of: {", ".join(CONDITIONS)}.'}), 400
    if not location:
        return jsonify({'error': 'Campus pickup location is required (e.g. Central Library, Hostel 3).'}), 400

    try:
        price = float(price_val)
        if price <= 0:
            raise ValueError()
    except (TypeError, ValueError):
        return jsonify({'error': 'Please enter a valid positive price in ₹.'}), 400

    if not image_url:
        # Default placeholder per category
        image_url = f"/static/images/categories/{category.lower().replace(' ', '_').replace('&', 'and')}.svg"

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO products (seller_id, title, description, category, price, condition, image_url, location, brand, contact_pref, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
    """, (current_user['id'], title, description, category, price, condition, image_url, location, brand, contact_pref))
    product_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return jsonify({
        'message': 'Product listing published successfully!',
        'product_id': product_id
    }), 201

@app.route('/api/products/<int:product_id>', methods=['PUT'])
@token_required
def update_product(current_user, product_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT seller_id FROM products WHERE id = ?", (product_id,))
    row = cursor.fetchone()

    if not row:
        conn.close()
        return jsonify({'error': 'Product not found.'}), 404

    if row['seller_id'] != current_user['id'] and current_user.get('role') != 'admin':
        conn.close()
        return jsonify({'error': 'You do not have permission to edit this listing.'}), 403

    data = request.get_json() or {}
    title = (data.get('title') or '').strip()
    category = (data.get('category') or '').strip()
    description = (data.get('description') or '').strip()
    price_val = data.get('price')
    condition = (data.get('condition') or '').strip()
    image_url = (data.get('image_url') or '').strip()
    location = (data.get('location') or '').strip()
    brand = (data.get('brand') or '').strip()
    contact_pref = (data.get('contact_pref') or 'Chat').strip()

    if not title or not category or not description or not condition or not location:
        conn.close()
        return jsonify({'error': 'All core fields are required.'}), 400

    try:
        price = float(price_val)
        if price <= 0:
            raise ValueError()
    except (TypeError, ValueError):
        conn.close()
        return jsonify({'error': 'Please enter a valid positive price.'}), 400

    cursor.execute("""
        UPDATE products
        SET title = ?, category = ?, description = ?, price = ?,
            condition = ?, image_url = CASE WHEN ? != '' THEN ? ELSE image_url END,
            location = ?, brand = ?, contact_pref = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    """, (title, category, description, price, condition, image_url, image_url, location, brand, contact_pref, product_id))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Listing updated successfully!'})

@app.route('/api/products/<int:product_id>/status', methods=['PATCH'])
@token_required
def update_product_status(current_user, product_id):
    data = request.get_json() or {}
    new_status = data.get('status')
    if new_status not in ['active', 'sold', 'removed']:
        return jsonify({'error': 'Invalid status value. Choose active or sold.'}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT seller_id, status FROM products WHERE id = ?", (product_id,))
    row = cursor.fetchone()

    if not row:
        conn.close()
        return jsonify({'error': 'Product listing not found.'}), 404

    if row['seller_id'] != current_user['id'] and current_user.get('role') != 'admin':
        conn.close()
        return jsonify({'error': 'Unauthorized to change status of this listing.'}), 403

    cursor.execute("""
        UPDATE products SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    """, (new_status, product_id))
    conn.commit()
    conn.close()

    return jsonify({'message': f'Listing marked as {new_status} successfully!', 'status': new_status})

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
@token_required
def delete_product(current_user, product_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT seller_id FROM products WHERE id = ?", (product_id,))
    row = cursor.fetchone()

    if not row:
        conn.close()
        return jsonify({'error': 'Product listing not found.'}), 404

    if row['seller_id'] != current_user['id'] and current_user.get('role') != 'admin':
        conn.close()
        return jsonify({'error': 'Unauthorized to delete this listing.'}), 403

    # Hard delete from DB
    cursor.execute("DELETE FROM products WHERE id = ?", (product_id,))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Listing deleted successfully.'})

# ----------------- WISHLIST ROUTES -----------------
@app.route('/api/wishlist', methods=['GET'])
@token_required
def get_wishlist(current_user):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT p.*, u.name as seller_name, u.department as seller_department,
               u.year as seller_year, w.created_at as saved_at
        FROM wishlist w
        JOIN products p ON w.product_id = p.id
        JOIN users u ON p.seller_id = u.id
        WHERE w.user_id = ?
        ORDER BY w.created_at DESC
    """, (current_user['id'],))
    items = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify(items)

@app.route('/api/wishlist/<int:product_id>', methods=['POST'])
@token_required
def toggle_wishlist(current_user, product_id):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM products WHERE id = ?", (product_id,))
    if not cursor.fetchone():
        conn.close()
        return jsonify({'error': 'Product listing not found.'}), 404

    cursor.execute("SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?", (current_user['id'], product_id))
    existing = cursor.fetchone()

    if existing:
        cursor.execute("DELETE FROM wishlist WHERE id = ?", (existing['id'],))
        conn.commit()
        conn.close()
        return jsonify({'saved': False, 'message': 'Removed from wishlist'})
    else:
        cursor.execute("INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)", (current_user['id'], product_id))
        conn.commit()
        conn.close()
        return jsonify({'saved': True, 'message': 'Added to your wishlist!'})

@app.route('/api/wishlist/<int:product_id>', methods=['DELETE'])
@token_required
def remove_from_wishlist(current_user, product_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM wishlist WHERE user_id = ? AND product_id = ?", (current_user['id'], product_id))
    conn.commit()
    conn.close()
    return jsonify({'saved': False, 'message': 'Removed from wishlist.'})

# ----------------- REPORTS ROUTES -----------------
@app.route('/api/reports', methods=['POST'])
@token_required
def report_product(current_user):
    data = request.get_json() or {}
    product_id = data.get('product_id')
    reason = (data.get('reason') or '').strip()
    details = (data.get('details') or '').strip()

    if not product_id:
        return jsonify({'error': 'Product ID is required.'}), 400
    if not reason:
        return jsonify({'error': 'Please select a reason for reporting.'}), 400

    conn = get_db()
    cursor = conn.cursor()

    # Ensure product exists
    cursor.execute("SELECT id FROM products WHERE id = ?", (product_id,))
    if not cursor.fetchone():
        conn.close()
        return jsonify({'error': 'Product not found.'}), 404

    # Check if user already reported this item
    cursor.execute("SELECT id FROM reports WHERE reporter_id = ? AND product_id = ?", (current_user['id'], product_id))
    if cursor.fetchone():
        conn.close()
        return jsonify({'error': 'You have already reported this listing. Our admin team is reviewing it.'}), 400

    cursor.execute("""
        INSERT INTO reports (reporter_id, product_id, reason, details, status)
        VALUES (?, ?, ?, ?, 'pending')
    """, (current_user['id'], product_id, reason, details))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Thank you! The listing has been submitted for administrative review.'}), 201

# ----------------- MESSAGING / CONTACT SELLER -----------------
@app.route('/api/messages', methods=['POST'])
@token_required
def send_message(current_user):
    data = request.get_json() or {}
    receiver_id = data.get('receiver_id')
    product_id = data.get('product_id')
    content = (data.get('content') or '').strip()

    if not receiver_id:
        return jsonify({'error': 'Receiver ID is required.'}), 400
    if not product_id:
        return jsonify({'error': 'Product reference is required.'}), 400
    if not content:
        return jsonify({'error': 'Message cannot be empty.'}), 400
    if int(receiver_id) == current_user['id']:
        return jsonify({'error': 'You cannot send a message to yourself.'}), 400

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO messages (sender_id, receiver_id, product_id, content, is_read)
        VALUES (?, ?, ?, ?, 0)
    """, (current_user['id'], receiver_id, product_id, content))
    msg_id = cursor.lastrowid
    conn.commit()

    cursor.execute("""
        SELECT m.*, u.name as sender_name
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.id = ?
    """, (msg_id,))
    message = dict(cursor.fetchone())
    conn.close()

    return jsonify({'message': 'Message sent successfully!', 'data': message}), 201

@app.route('/api/conversations', methods=['GET'])
@token_required
def get_conversations(current_user):
    conn = get_db()
    cursor = conn.cursor()

    # Group messages by product and other user
    query = """
        SELECT 
            m.product_id,
            p.title as product_title,
            p.price as product_price,
            p.image_url as product_image,
            p.status as product_status,
            CASE WHEN m.sender_id = :uid THEN m.receiver_id ELSE m.sender_id END as other_user_id,
            u.name as other_user_name,
            u.department as other_user_department,
            u.year as other_user_year,
            u.avatar_url as other_user_avatar,
            MAX(m.created_at) as last_message_time,
            (SELECT content FROM messages 
             WHERE product_id = m.product_id 
               AND ((sender_id = :uid AND receiver_id = other_user_id) OR (sender_id = other_user_id AND receiver_id = :uid))
             ORDER BY created_at DESC LIMIT 1) as last_message,
            SUM(CASE WHEN m.receiver_id = :uid AND m.is_read = 0 THEN 1 ELSE 0 END) as unread_count
        FROM messages m
        JOIN products p ON m.product_id = p.id
        JOIN users u ON u.id = CASE WHEN m.sender_id = :uid THEN m.receiver_id ELSE m.sender_id END
        WHERE m.sender_id = :uid OR m.receiver_id = :uid
        GROUP BY m.product_id, other_user_id
        ORDER BY last_message_time DESC
    """
    cursor.execute(query, {'uid': current_user['id']})
    conversations = [dict(r) for r in cursor.fetchall()]
    conn.close()

    return jsonify(conversations)

@app.route('/api/messages/<int:other_user_id>/<int:product_id>', methods=['GET'])
@token_required
def get_thread(current_user, other_user_id, product_id):
    conn = get_db()
    cursor = conn.cursor()

    # Mark incoming messages in this thread as read
    cursor.execute("""
        UPDATE messages 
        SET is_read = 1
        WHERE sender_id = ? AND receiver_id = ? AND product_id = ? AND is_read = 0
    """, (other_user_id, current_user['id'], product_id))
    conn.commit()

    # Fetch messages
    cursor.execute("""
        SELECT m.*, u.name as sender_name
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.product_id = ?
          AND ((m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?))
        ORDER BY m.created_at ASC
    """, (product_id, current_user['id'], other_user_id, other_user_id, current_user['id']))
    messages = [dict(r) for r in cursor.fetchall()]

    # Fetch product info
    cursor.execute("SELECT id, title, price, status, image_url, seller_id FROM products WHERE id = ?", (product_id,))
    product = dict(cursor.fetchone() or {})

    # Fetch other user info
    cursor.execute("SELECT id, name, department, year, email, phone FROM users WHERE id = ?", (other_user_id,))
    other_user = dict(cursor.fetchone() or {})

    conn.close()

    return jsonify({
        'product': product,
        'other_user': other_user,
        'messages': messages
    })

# ----------------- ADMIN DASHBOARD ROUTES -----------------
@app.route('/api/admin/stats', methods=['GET'])
@admin_required
def get_admin_stats(current_user):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) as cnt FROM users WHERE role = 'student'")
    total_users = cursor.fetchone()['cnt']

    cursor.execute("SELECT COUNT(*) as cnt FROM products")
    total_listings = cursor.fetchone()['cnt']

    cursor.execute("SELECT COUNT(*) as cnt FROM products WHERE status = 'active'")
    active_listings = cursor.fetchone()['cnt']

    cursor.execute("SELECT COUNT(*) as cnt FROM products WHERE status = 'sold'")
    sold_listings = cursor.fetchone()['cnt']

    cursor.execute("SELECT COUNT(*) as cnt FROM reports WHERE status = 'pending'")
    reported_listings = cursor.fetchone()['cnt']

    # Total reports overall
    cursor.execute("SELECT COUNT(*) as cnt FROM reports")
    all_reports = cursor.fetchone()['cnt']

    conn.close()

    return jsonify({
        'total_users': total_users,
        'total_listings': total_listings,
        'active_listings': active_listings,
        'sold_listings': sold_listings,
        'reported_listings': reported_listings,
        'total_reports': all_reports
    })

@app.route('/api/admin/reports', methods=['GET'])
@admin_required
def get_admin_reports(current_user):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT r.*, 
               u.name as reporter_name, u.email as reporter_email,
               p.title as product_title, p.price as product_price, p.status as product_status,
               p.image_url as product_image,
               s.name as seller_name, s.email as seller_email
        FROM reports r
        JOIN users u ON r.reporter_id = u.id
        JOIN products p ON r.product_id = p.id
        JOIN users s ON p.seller_id = s.id
        ORDER BY CASE WHEN r.status = 'pending' THEN 0 ELSE 1 END, r.created_at DESC
    """)
    reports = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify(reports)

@app.route('/api/admin/reports/<int:report_id>', methods=['PATCH'])
@admin_required
def resolve_report(current_user, report_id):
    data = request.get_json() or {}
    action = data.get('action')  # 'dismiss' or 'resolve_remove'
    
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT product_id FROM reports WHERE id = ?", (report_id,))
    report = cursor.fetchone()
    if not report:
        conn.close()
        return jsonify({'error': 'Report not found.'}), 404

    if action == 'resolve_remove':
        # Mark report as resolved and remove the offending listing
        cursor.execute("UPDATE reports SET status = 'resolved' WHERE id = ?", (report_id,))
        cursor.execute("UPDATE products SET status = 'removed' WHERE id = ?", (report['product_id'],))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Report resolved: listing has been removed from marketplace.'})
    else:
        # Dismiss report
        cursor.execute("UPDATE reports SET status = 'dismissed' WHERE id = ?", (report_id,))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Report dismissed.'})

@app.route('/api/admin/users', methods=['GET'])
@admin_required
def get_admin_users(current_user):
    q = (request.args.get('q') or '').strip()
    conn = get_db()
    cursor = conn.cursor()

    query = """
        SELECT u.id, u.name, u.email, u.department, u.year, u.role, u.status, u.created_at,
               COUNT(p.id) as total_listings,
               SUM(CASE WHEN p.status = 'sold' THEN 1 ELSE 0 END) as sold_listings
        FROM users u
        LEFT JOIN products p ON u.id = p.seller_id
        WHERE 1=1
    """
    params = []
    if q:
        query += " AND (u.name LIKE ? OR u.email LIKE ? OR u.department LIKE ?)"
        params.extend([f"%{q}%", f"%{q}%", f"%{q}%"])

    query += " GROUP BY u.id ORDER BY u.created_at DESC"
    cursor.execute(query, params)
    users = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify(users)

@app.route('/api/admin/users/<int:user_id>/status', methods=['PATCH'])
@admin_required
def update_user_status(current_user, user_id):
    if user_id == current_user['id']:
        return jsonify({'error': 'You cannot change your own administrator status.'}), 400

    data = request.get_json() or {}
    new_status = data.get('status')
    if new_status not in ['active', 'suspended']:
        return jsonify({'error': 'Invalid status. Use active or suspended.'}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET status = ? WHERE id = ?", (new_status, user_id))
    
    # If suspending, invalidate tokens
    if new_status == 'suspended':
        cursor.execute("DELETE FROM tokens WHERE user_id = ?", (user_id,))

    conn.commit()
    conn.close()

    return jsonify({'message': f'User account has been {new_status}.', 'status': new_status})

@app.route('/api/admin/listings', methods=['GET'])
@admin_required
def get_admin_listings(current_user):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT p.*, u.name as seller_name, u.email as seller_email,
               (SELECT COUNT(*) FROM reports WHERE product_id = p.id) as reports_count
        FROM products p
        JOIN users u ON p.seller_id = u.id
        ORDER BY p.created_at DESC
    """)
    listings = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify(listings)

# ----------------- IMAGE UPLOADER -----------------
@app.route('/api/upload', methods=['POST'])
@token_required
def upload_file(current_user):
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded.'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Empty filename.'}), 400

    ext = file.filename.rsplit('.', 1)[-1].lower() if '.' in file.filename else ''
    if ext not in ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg']:
        return jsonify({'error': 'Invalid file format. Allowed: JPG, PNG, WEBP, SVG.'}), 400

    filename = f"item_{current_user['id']}_{int(datetime.utcnow().timestamp())}_{secure_filename(file.filename)}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    return jsonify({
        'url': f"/static/uploads/{filename}",
        'message': 'Image uploaded successfully!'
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5050))
    app.run(host='127.0.0.1', port=port, debug=True)
