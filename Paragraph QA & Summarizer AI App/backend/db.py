# db.py
import sqlite3
import os

DB_PATH = "users.db"

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    if not os.path.exists(DB_PATH):
        print("📦 Creating users.db...")
    else:
        print("🔍 users.db already exists.")

    conn = get_connection()
    cur = conn.cursor()
    cur.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()
    print("✅ Database initialized.")

# ✅ For FastAPI startup
def initialize():
    init_db()

# ✅ For manual script execution
if __name__ == "__main__":
    initialize()
