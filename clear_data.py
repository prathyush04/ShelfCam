import sqlite3
import os

# Clear all data from SQLite database
try:
    db_path = './ShelfCam-Backend-main/database/sqlite.db'
    if os.path.exists(db_path):
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Clear shelves table
        cursor.execute("DELETE FROM shelves")
        print("✅ Cleared all shelves from database")
        
        # Clear staff assignments
        cursor.execute("DELETE FROM staff_assignments")
        print("✅ Cleared all staff assignments from database")
        
        conn.commit()
        cursor.close()
        conn.close()
        print("✅ Database cleared successfully")
    else:
        print("❌ Database file not found")
        
except Exception as e:
    print(f"❌ Error: {e}")