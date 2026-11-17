import sqlite3
import os
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'campusmart.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.executescript("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL COLLATE NOCASE,
        password_hash TEXT NOT NULL,
        department TEXT NOT NULL,
        year TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'student',
        status TEXT NOT NULL DEFAULT 'active',
        phone TEXT,
        avatar_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        seller_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        condition TEXT NOT NULL,
        image_url TEXT NOT NULL,
        location TEXT NOT NULL,
        brand TEXT,
        contact_pref TEXT DEFAULT 'Chat',
        status TEXT NOT NULL DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS wishlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reporter_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        reason TEXT NOT NULL,
        details TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_id INTEGER NOT NULL,
        receiver_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        is_read INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tokens (
        token TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id);
    CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
    CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
    CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist(user_id);
    CREATE INDEX IF NOT EXISTS idx_messages_users ON messages(sender_id, receiver_id);
    """)

    conn.commit()
    conn.close()

def seed_data():
    conn = get_db()
    cursor = conn.cursor()

    # Check if users already exist
    cursor.execute("SELECT COUNT(*) as cnt FROM users")
    if cursor.fetchone()['cnt'] > 0:
        conn.close()
        return

    # Seed Users
    users_data = [
        ("Campus Admin", "admin@campusmart.edu", generate_password_hash("admin123"), "Administration", "Faculty / Staff", "admin", "active", "+91 98765 00000", "/static/images/avatars/admin.svg"),
        ("Rahul Sharma", "rahul@campusmart.edu", generate_password_hash("student123"), "Computer Science", "3rd Year", "student", "active", "+91 98765 43210", "/static/images/avatars/rahul.svg"),
        ("Priya Patel", "priya@campusmart.edu", generate_password_hash("student123"), "Electrical Engineering", "2nd Year", "student", "active", "+91 98765 43211", "/static/images/avatars/priya.svg"),
        ("Rohan Verma", "rohan@campusmart.edu", generate_password_hash("student123"), "Mechanical Engineering", "4th Year", "student", "active", "+91 98765 43212", "/static/images/avatars/rohan.svg"),
        ("Ananya Sen", "ananya@campusmart.edu", generate_password_hash("student123"), "Civil Engineering", "1st Year", "student", "active", "+91 98765 43213", "/static/images/avatars/ananya.svg"),
        ("Vikram Malhotra", "vikram@campusmart.edu", generate_password_hash("student123"), "Information Technology", "3rd Year", "student", "active", "+91 98765 43214", "/static/images/avatars/vikram.svg"),
    ]

    cursor.executemany("""
        INSERT INTO users (name, email, password_hash, department, year, role, status, phone, avatar_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, users_data)

    # Fetch inserted user IDs
    user_ids = {}
    cursor.execute("SELECT email, id FROM users")
    for row in cursor.fetchall():
        user_ids[row['email']] = row['id']

    # Seed Sample Products
    products_data = [
        (
            user_ids['rahul@campusmart.edu'],
            "Data Structures Using C",
            "Comprehensive textbook by Reema Thareja. Includes algorithms, pseudo-code, and C implementations. Highlighted key concepts for semester exams. Perfect condition with no torn pages.",
            "Books",
            350.0,
            "Good",
            "/static/images/products/data_structures.svg",
            "Central Library Steps",
            "Oxford University Press",
            "Chat",
            "active"
        ),
        (
            user_ids['priya@campusmart.edu'],
            "Engineering Mathematics Book",
            "Higher Engineering Mathematics by B.S. Grewal (44th Edition). Covers Calculus, Differential Equations, and Linear Algebra. Essential for 1st and 2nd year students.",
            "Books",
            250.0,
            "Good",
            "/static/images/products/eng_maths.svg",
            "Main Academic Block Cafe",
            "Khanna Publishers",
            "Chat",
            "active"
        ),
        (
            user_ids['rohan@campusmart.edu'],
            "Scientific Calculator (Casio fx-991EX)",
            "Original Casio fx-991EX ClassWiz high-resolution scientific calculator. 552 functions, solar powered + battery backup. Permitted in university semester exams. Includes slide-on protective case.",
            "Calculators",
            700.0,
            "Like New",
            "/static/images/products/calculator.svg",
            "Mechanical Engineering Lab",
            "Casio",
            "WhatsApp",
            "active"
        ),
        (
            user_ids['ananya@campusmart.edu'],
            "Lab Coat (Size M)",
            "100% thick white cotton laboratory apron. Mandated for Chemistry and Biology labs. Freshly dry-cleaned with college crest pocket embroidery. Full sleeves with deep utility pockets.",
            "Lab Equipment",
            300.0,
            "Good",
            "/static/images/products/lab_coat.svg",
            "Chemistry Department Corridor",
            "Campus Standard",
            "Chat",
            "active"
        ),
        (
            user_ids['rahul@campusmart.edu'],
            "Drawing Board & Mini Drafter Set",
            "Standard Imperial wooden drawing board (23x32 inches) with calibrated Omega mini-drafter and board clamps. Used only for one semester in Engineering Graphics.",
            "Stationery",
            500.0,
            "Good",
            "/static/images/products/drawing_board.svg",
            "Central Workshop Entrance",
            "Omega",
            "Phone",
            "active"
        ),
        (
            user_ids['priya@campusmart.edu'],
            "Used College Backpack",
            "Heavy-duty waterproof 32L college backpack with dedicated padded laptop compartment (up to 15.6\"), secret anti-theft back pocket, and dual water bottle holders.",
            "Bags & Accessories",
            450.0,
            "Good",
            "/static/images/products/backpack.svg",
            "Student Union Plaza",
            "Wildcraft",
            "Chat",
            "active"
        ),
        (
            user_ids['rohan@campusmart.edu'],
            "Arduino Uno Starter Kit",
            "Arduino Uno R3 microcontroller board with breadboard, 16x2 LCD display, servo motor, ultrasonic sensor, jumper wires, resistors, and LEDs. Ideal for IoT and robotics projects.",
            "Electronics",
            900.0,
            "Like New",
            "/static/images/products/arduino_kit.svg",
            "Robotics & Innovation Lab",
            "Elegoo / Arduino",
            "Chat",
            "active"
        ),
        (
            user_ids['ananya@campusmart.edu'],
            "Engineering Graphics Instruments",
            "Complete engineering geometry box with precision compass, divider, lengthening bar, ruling pen, protractor, set squares, and French curves in a sturdy hard case.",
            "Lab Equipment",
            400.0,
            "Like New",
            "/static/images/products/graphics_instruments.svg",
            "Civil Engineering Block Foyer",
            "Koh-I-Noor",
            "Chat",
            "active"
        ),
        (
            user_ids['rahul@campusmart.edu'],
            "Digital Electronics Handwritten Notes",
            "Complete handwritten lecture notes covering Boolean algebra, logic gates, flip-flops, counters, registers, and state machines. Clear circuit diagrams and solved previous exam papers.",
            "Notes & Study Material",
            150.0,
            "Good",
            "/static/images/products/notes.svg",
            "Central Library 2nd Floor",
            "Self-Authored",
            "Chat",
            "active"
        ),
        (
            user_ids['priya@campusmart.edu'],
            "College Uniform Blazer (Navy Blue)",
            "Official campus uniform navy blue wool-blend blazer, chest size 38. Gold crest buttons, interior phone pocket. Worn only during formal events and placement interviews.",
            "College Uniform",
            850.0,
            "Like New",
            "/static/images/products/blazer.svg",
            "North Campus Gate",
            "Raymond Campus Tailoring",
            "Chat",
            "active"
        ),
        (
            user_ids['vikram@campusmart.edu'],
            "Electric Kettle 1.5L (Hostel Essential)",
            "Stainless steel fast-boiling electric kettle with automatic shut-off and boil-dry protection. Allowed in hostel rooms. Clean heating element, spotless interior.",
            "Hostel Items",
            600.0,
            "Like New",
            "/static/images/products/kettle.svg",
            "Hostel Block 4 Reception",
            "Pigeon",
            "Chat",
            "active"
        ),
        (
            user_ids['vikram@campusmart.edu'],
            "Rechargeable LED Desk Study Lamp",
            "Flexible neck 3-mode dimmable touch LED study lamp. Built-in 2000mAh battery for 6 hours of power backup during hostel power cuts. USB rechargeable with pen stand.",
            "Hostel Items",
            350.0,
            "Good",
            "/static/images/products/desk_lamp.svg",
            "Hostel Block 4 Reception",
            "Wipro",
            "Chat",
            "active"
        )
    ]

    cursor.executemany("""
        INSERT INTO products (seller_id, title, description, category, price, condition, image_url, location, brand, contact_pref, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, products_data)

    # Fetch product IDs
    cursor.execute("SELECT id, title FROM products")
    product_map = {row['title']: row['id'] for row in cursor.fetchall()}

    # Mark one product as Sold to demonstrate marketplace status logic
    cursor.execute("""
        UPDATE products SET status = 'sold' WHERE title = 'Used College Backpack'
    """)

    # Seed Wishlist items
    cursor.execute("""
        INSERT INTO wishlist (user_id, product_id)
        VALUES (?, ?)
    """, (user_ids['rahul@campusmart.edu'], product_map['Scientific Calculator (Casio fx-991EX)']))

    cursor.execute("""
        INSERT INTO wishlist (user_id, product_id)
        VALUES (?, ?)
    """, (user_ids['priya@campusmart.edu'], product_map['Data Structures Using C']))

    # Seed a sample Report for the Admin Moderation Dashboard
    cursor.execute("""
        INSERT INTO reports (reporter_id, product_id, reason, details, status)
        VALUES (?, ?, ?, ?, ?)
    """, (
        user_ids['ananya@campusmart.edu'],
        product_map['Scientific Calculator (Casio fx-991EX)'],
        "Incorrect Price / Duplicate",
        "Seller listed this slightly higher than current market rate on official store. Requesting verification.",
        "pending"
    ))

    # Seed sample messages / conversation
    cursor.execute("""
        INSERT INTO messages (sender_id, receiver_id, product_id, content, is_read)
        VALUES (?, ?, ?, ?, ?)
    """, (
        user_ids['priya@campusmart.edu'],
        user_ids['rahul@campusmart.edu'],
        product_map['Data Structures Using C'],
        "Hi Rahul! Is the Data Structures book still available? Can we meet today at Central Library?",
        1
    ))

    cursor.execute("""
        INSERT INTO messages (sender_id, receiver_id, product_id, content, is_read)
        VALUES (?, ?, ?, ?, ?)
    """, (
        user_ids['rahul@campusmart.edu'],
        user_ids['priya@campusmart.edu'],
        product_map['Data Structures Using C'],
        "Hey Priya, yes it is! I have class until 3:30 PM. I can meet you outside the library entrance at 4:00 PM.",
        0
    ))

    conn.commit()
    conn.close()
    print("Database initialized and seeded successfully!")

if __name__ == '__main__':
    init_db()
    seed_data()
