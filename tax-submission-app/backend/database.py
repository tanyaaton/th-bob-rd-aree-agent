import sqlite3
import json
from datetime import datetime

DATABASE_NAME = 'tax_database.db'

def get_db_connection():
    """Create a database connection."""
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize the database with tables and seed data."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            national_id TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            lastname TEXT NOT NULL,
            address TEXT,
            birthday DATE
        )
    ''')
    
    # Create tax_submissions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tax_submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            name TEXT NOT NULL,
            national_id TEXT NOT NULL,
            income_data TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')
    
    # Check if Bobby Watson already exists
    cursor.execute('SELECT * FROM users WHERE national_id = ?', ('1234567890123',))
    if not cursor.fetchone():
        # Insert Bobby Watson as the default user
        cursor.execute('''
            INSERT INTO users (national_id, name, lastname, address, birthday)
            VALUES (?, ?, ?, ?, ?)
        ''', ('1234567890123', 'Bobby', 'Watson', '123 Main Street, Bangkok, Thailand', '1990-01-15'))
        print("✓ Bobby Watson user created successfully")
    else:
        print("✓ Bobby Watson user already exists")
    
    conn.commit()
    conn.close()
    print("✓ Database initialized successfully")

def get_user_by_national_id(national_id):
    """Get user information by National ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM users
        WHERE national_id = ?
    ''', (national_id,))
    
    user = cursor.fetchone()
    conn.close()
    
    return dict(user) if user else None

def validate_user(national_id):
    """Validate user by National ID only."""
    user = get_user_by_national_id(national_id)
    return user is not None

def submit_tax_form(name, national_id, income_data):
    """Submit a new tax form to the database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get user_id
    cursor.execute('SELECT id FROM users WHERE national_id = ?', (national_id,))
    user = cursor.fetchone()
    
    if not user:
        conn.close()
        return None
    
    user_id = user['id']
    
    # Convert income_data to JSON string
    income_json = json.dumps(income_data, ensure_ascii=False)
    
    # Insert submission
    cursor.execute('''
        INSERT INTO tax_submissions (user_id, name, national_id, income_data)
        VALUES (?, ?, ?, ?)
    ''', (user_id, name, national_id, income_json))
    
    submission_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return submission_id

def get_all_submissions():
    """Retrieve all tax submissions from the database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT id, submission_date, name, national_id, income_data
        FROM tax_submissions
        ORDER BY submission_date DESC
    ''')
    
    submissions = []
    for row in cursor.fetchall():
        submission = {
            'id': row['id'],
            'submission_date': row['submission_date'],
            'name': row['name'],
            'national_id': row['national_id'],
            'income_data': json.loads(row['income_data'])
        }
        submissions.append(submission)
    
    conn.close()
    return submissions

if __name__ == '__main__':
    # Initialize database when run directly
    init_db()

# Made with Bob
