import sqlite3
import os

# Create database directory if it doesn't exist
os.makedirs('database', exist_ok=True)

try:
    conn = sqlite3.connect('./database/sqlite.db')
    cursor = conn.cursor()
    
    # Create employees table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            employee_id TEXT UNIQUE,
            username TEXT UNIQUE,
            password TEXT,
            role TEXT,
            email TEXT,
            phone TEXT,
            is_active BOOLEAN DEFAULT 1
        )
    """)
    
    # Insert test users
    cursor.execute("""
        INSERT OR IGNORE INTO employees (employee_id, username, password, role, email, phone, is_active) 
        VALUES 
        ('E101', 'john_doe', 'password123', 'staff', 'john@example.com', '1234567890', 1),
        ('M001', 'manager1', 'manager123', 'manager', 'manager@example.com', '0987654321', 1),
        ('A001', 'admin1', 'admin123', 'admin', 'admin@example.com', '1122334455', 1)
    """)
    
    conn.commit()
    print("✅ Test users inserted successfully!")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print("❌ Error:", e)