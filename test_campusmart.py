"""
Comprehensive Automated Test Suite for CampusMart
Tests Database, Authentication, Role-based Access, CRUD, Wishlist, Messaging, Reports, and Security.
"""

import unittest
import json
from app import app
from database import get_db, init_db, seed_data

class CampusMartTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()
        seed_data()
        cls.client = app.test_client()

    def test_01_seed_data_integrity(self):
        """Verify initial seeded data has users and products"""
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) as cnt FROM users")
        user_cnt = cursor.fetchone()['cnt']
        self.assertGreaterEqual(user_cnt, 5)

        cursor.execute("SELECT COUNT(*) as cnt FROM products")
        prod_cnt = cursor.fetchone()['cnt']
        self.assertGreaterEqual(prod_cnt, 8)
        conn.close()

    def test_02_login_and_password_hashing(self):
        """Verify student login works and password is not stored in plaintext"""
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT password_hash FROM users WHERE email = 'rahul@campusmart.edu'")
        row = cursor.fetchone()
        self.assertIsNotNone(row)
        self.assertNotEqual(row['password_hash'], 'student123')
        self.assertTrue(row['password_hash'].startswith(('scrypt:', 'pbkdf2:')))
        conn.close()

        # Test valid login
        res = self.client.post('/api/auth/login', json={
            'email': 'rahul@campusmart.edu',
            'password': 'student123'
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('token', data)
        self.assertEqual(data['user']['name'], 'Rahul Sharma')

    def test_03_registration_and_validation(self):
        """Test registration endpoint with validation"""
        # Mismatched password
        res = self.client.post('/api/auth/register', json={
            'name': 'Test Student',
            'email': 'test@campusmart.edu',
            'password': 'password123',
            'confirm_password': 'password_wrong',
            'department': 'CS',
            'year': '1st Year'
        })
        self.assertEqual(res.status_code, 400)

        # Successful registration with unique email
        import time
        unique_email = f"newstudent_{int(time.time() * 1000)}@campusmart.edu"
        res = self.client.post('/api/auth/register', json={
            'name': 'New Student',
            'email': unique_email,
            'password': 'password123',
            'confirm_password': 'password123',
            'department': 'Information Technology',
            'year': '2nd Year'
        })
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        self.assertIn('token', data)
        self.assertEqual(data['user']['email'], unique_email)

    def test_04_product_creation_and_authorization(self):
        """Test creating product, updating own product, and preventing unauthorized edit"""
        # Login as Priya
        res = self.client.post('/api/auth/login', json={
            'email': 'priya@campusmart.edu',
            'password': 'student123'
        })
        priya_token = res.get_json()['token']

        # Create product
        res = self.client.post('/api/products', json={
            'title': 'Priya Physics Practical Manual',
            'category': 'Notes & Study Material',
            'description': 'Complete solved physics manual with error graphs',
            'price': 180,
            'condition': 'Good',
            'location': 'Physics Lab steps'
        }, headers={'Authorization': f'Bearer {priya_token}'})
        self.assertEqual(res.status_code, 201)
        product_id = res.get_json()['product_id']

        # Update own product
        res = self.client.put(f'/api/products/{product_id}', json={
            'title': 'Priya Physics Practical Manual (Updated)',
            'category': 'Notes & Study Material',
            'description': 'Complete solved physics manual with all lab experiments',
            'price': 200,
            'condition': 'Like New',
            'location': 'Physics Lab'
        }, headers={'Authorization': f'Bearer {priya_token}'})
        self.assertEqual(res.status_code, 200)

        # Login as Rahul and try to edit Priya's product (must fail with 403)
        res = self.client.post('/api/auth/login', json={
            'email': 'rahul@campusmart.edu',
            'password': 'student123'
        })
        rahul_token = res.get_json()['token']

        res = self.client.put(f'/api/products/{product_id}', json={
            'title': 'Hacked Title',
            'category': 'Notes & Study Material',
            'description': 'Unauthorized edit',
            'price': 10,
            'condition': 'Fair',
            'location': 'Nowhere'
        }, headers={'Authorization': f'Bearer {rahul_token}'})
        self.assertEqual(res.status_code, 403)

    def test_05_sold_status_toggle(self):
        """Test marking item as sold and verifying badge logic"""
        # Login as Priya
        res = self.client.post('/api/auth/login', json={
            'email': 'priya@campusmart.edu',
            'password': 'student123'
        })
        priya_token = res.get_json()['token']

        # Find one of Priya's products
        res = self.client.get('/api/products?seller_id=3')
        products = res.get_json()
        if not products:
            # Create one
            res = self.client.post('/api/products', json={
                'title': 'Item to Mark Sold',
                'category': 'Books',
                'description': 'Book to test sold toggle',
                'price': 150,
                'condition': 'Good',
                'location': 'Library'
            }, headers={'Authorization': f'Bearer {priya_token}'})
            prod_id = res.get_json()['product_id']
        else:
            prod_id = products[0]['id']

        # Mark as sold
        res = self.client.patch(f'/api/products/{prod_id}/status', json={'status': 'sold'},
                                headers={'Authorization': f'Bearer {priya_token}'})
        self.assertEqual(res.status_code, 200)

        # Fetch product and verify status is 'sold'
        res = self.client.get(f'/api/products/{prod_id}')
        self.assertEqual(res.get_json()['status'], 'sold')

    def test_06_wishlist_toggle(self):
        """Test adding and removing from wishlist"""
        res = self.client.post('/api/auth/login', json={
            'email': 'rahul@campusmart.edu',
            'password': 'student123'
        })
        token = res.get_json()['token']

        # Toggle wishlist on product 1
        res = self.client.post('/api/wishlist/1', headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(res.status_code, 200)
        self.assertIn('saved', res.get_json())

    def test_07_messaging_system(self):
        """Test sending message from student to seller"""
        # Login as Priya
        res = self.client.post('/api/auth/login', json={
            'email': 'priya@campusmart.edu',
            'password': 'student123'
        })
        priya_token = res.get_json()['token']

        # Send message to Rahul regarding Product 1
        res = self.client.post('/api/messages', json={
            'receiver_id': 2, # Rahul
            'product_id': 1,
            'content': 'Hi Rahul, are you free to meet at 2pm near library?'
        }, headers={'Authorization': f'Bearer {priya_token}'})
        self.assertEqual(res.status_code, 201)

        # Retrieve thread
        res = self.client.get('/api/messages/2/1', headers={'Authorization': f'Bearer {priya_token}'})
        self.assertEqual(res.status_code, 200)
        thread = res.get_json()
        self.assertGreater(len(thread['messages']), 0)

    def test_08_admin_role_security_and_moderation(self):
        """Test admin role checks and moderation controls"""
        # Rahul (student) attempting to access admin endpoints -> 403
        res = self.client.post('/api/auth/login', json={
            'email': 'rahul@campusmart.edu',
            'password': 'student123'
        })
        rahul_token = res.get_json()['token']

        res = self.client.get('/api/admin/stats', headers={'Authorization': f'Bearer {rahul_token}'})
        self.assertEqual(res.status_code, 403)

        # Student login should reject admin accounts with guidance to use admin portal
        res = self.client.post('/api/auth/login', json={
            'email': 'admin@campusmart.edu',
            'password': 'admin123'
        })
        self.assertEqual(res.status_code, 403)
        self.assertIn('dedicated Admin Login portal', res.get_json()['error'])

    def test_09_separate_admin_login_flow(self):
        """Test dedicated admin login using fixed credentials admin / admin and error validation"""
        # 1. Invalid credentials -> exact message "Invalid admin credentials"
        res = self.client.post('/api/auth/admin-login', json={
            'login_id': 'admin',
            'password': 'wrongpassword'
        })
        self.assertEqual(res.status_code, 401)
        self.assertEqual(res.get_json()['error'], 'Invalid admin credentials')

        res = self.client.post('/api/auth/admin-login', json={
            'login_id': 'hacker',
            'password': 'admin'
        })
        self.assertEqual(res.status_code, 401)
        self.assertEqual(res.get_json()['error'], 'Invalid admin credentials')

        # 2. Valid credentials: admin / admin
        res = self.client.post('/api/auth/admin-login', json={
            'login_id': 'admin',
            'password': 'admin'
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('token', data)
        self.assertEqual(data['user']['role'], 'admin')
        admin_token = data['token']

        # 3. Access Admin Dashboard with admin token
        res = self.client.get('/api/admin/stats', headers={'Authorization': f'Bearer {admin_token}'})
        self.assertEqual(res.status_code, 200)
        stats = res.get_json()
        self.assertIn('total_users', stats)
        self.assertIn('total_listings', stats)

        # 4. Admin reports
        res = self.client.get('/api/admin/reports', headers={'Authorization': f'Bearer {admin_token}'})
        self.assertEqual(res.status_code, 200)

if __name__ == '__main__':
    unittest.main()
