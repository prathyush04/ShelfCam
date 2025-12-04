import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

try:
    # Connect to postgres database to create new database
    conn = psycopg2.connect("postgresql://postgres:Prathyush%4004@localhost:5432/postgres")
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    
    # Create database
    cursor.execute("CREATE DATABASE shelfcam_auth")
    print("Database created successfully!")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    if "already exists" in str(e):
        print("Database already exists!")
    else:
        print("Error:", e)