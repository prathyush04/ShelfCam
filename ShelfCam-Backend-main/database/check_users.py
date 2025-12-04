import psycopg2

try:
    conn = psycopg2.connect("postgresql://postgres:Prathyush%4004@localhost:5432/postgres")
    cursor = conn.cursor()
    
    # Check existing users with passwords
    cursor.execute("SELECT employee_id, username, password, role, email FROM employees")
    users = cursor.fetchall()
    
    print("Existing users in database:")
    for user in users:
        print(f"   Employee ID: {user[0]}, Username: {user[1]}, Password: {user[2]}, Role: {user[3]}, Email: {user[4]}")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print("Error:", e)