import psycopg2

try:
    conn = psycopg2.connect("postgresql://postgres:Prathyush%4004@localhost:5432/postgres")
    cursor = conn.cursor()
    
    # Create employees table if it doesn't exist
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS employees (
            id SERIAL PRIMARY KEY,
            employee_id VARCHAR UNIQUE,
            username VARCHAR UNIQUE,
            password VARCHAR,
            role VARCHAR,
            email VARCHAR,
            phone VARCHAR,
            is_active BOOLEAN DEFAULT true
        )
    """)
    
    # Insert test users
    cursor.execute("""
        INSERT INTO employees (employee_id, username, password, role, email, phone, is_active) 
        VALUES 
        ('E101', 'john_doe', 'password123', 'staff', 'john@example.com', '1234567890', true),
        ('M001', 'manager1', 'manager123', 'manager', 'manager@example.com', '0987654321', true),
        ('A001', 'admin1', 'admin123', 'admin', 'admin@example.com', '1122334455', true)
        ON CONFLICT (employee_id) DO NOTHING
    """)
    
    conn.commit()
    print("✅ Test users inserted successfully!")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print("❌ Error:", e)