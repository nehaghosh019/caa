import secrets
from datetime import datetime, timedelta, timezone
from functools import wraps
from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_db

def hash_password(password: str) -> str:
    return generate_password_hash(password)

def verify_password(password: str, password_hash: str) -> bool:
    return check_password_hash(password_hash, password)

def generate_token(user_id: int, hours: int = 72) -> str:
    token = secrets.token_hex(32)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=hours)
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO tokens (token, user_id, expires_at)
        VALUES (?, ?, ?)
    """, (token, user_id, expires_at.strftime('%Y-%m-%d %H:%M:%S')))
    conn.commit()
    conn.close()
    return token

def get_user_from_token(token: str):
    if not token:
        return None
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT u.id, u.name, u.email, u.department, u.year, u.role, u.status, u.phone, u.avatar_url, u.created_at, t.expires_at
        FROM tokens t
        JOIN users u ON t.user_id = u.id
        WHERE t.token = ?
    """, (token,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return None

    # SQLite string timestamp comparison
    expires_at = datetime.strptime(row['expires_at'], '%Y-%m-%d %H:%M:%S').replace(tzinfo=timezone.utc)
    if datetime.now(timezone.utc) > expires_at:
        # Token expired
        return None

    if row['status'] == 'suspended':
        return {'suspended': True, 'email': row['email']}

    return dict(row)

def delete_token(token: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tokens WHERE token = ?", (token,))
    conn.commit()
    conn.close()

def get_token_from_request():
    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Bearer '):
        return auth_header[7:].strip()
    return request.args.get('token', '')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_from_request()
        if not token:
            return jsonify({'error': 'Authentication token is missing. Please log in.'}), 401

        user = get_user_from_token(token)
        if not user:
            return jsonify({'error': 'Session expired or invalid token. Please log in again.'}), 401

        if user.get('suspended'):
            return jsonify({'error': 'Your student account has been suspended by campus moderation.'}), 403

        return f(user, *args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_from_request()
        if not token:
            return jsonify({'error': 'Authentication token is missing.'}), 401

        user = get_user_from_token(token)
        if not user or user.get('role') != 'admin':
            return jsonify({'error': 'Access denied: Admin privileges required.'}), 403

        return f(user, *args, **kwargs)
    return decorated

def optional_user(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_from_request()
        user = get_user_from_token(token) if token else None
        if user and user.get('suspended'):
            user = None
        return f(user, *args, **kwargs)
    return decorated
