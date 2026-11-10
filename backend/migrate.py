import psycopg2

conn_str = "postgresql://postgres.grbopzrunuydwbyqkjgm:Ayushkrr07%40%40@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"

def run_migration():
    print("Reading schema.sql...")
    with open("backend/schema.sql", "r", encoding="utf-8") as f:
        sql = f.read()

    print("Connecting to Supabase PostgreSQL...")
    conn = psycopg2.connect(conn_str)
    conn.autocommit = True
    cur = conn.cursor()
    
    print("Executing schema.sql...")
    cur.execute(sql)
    print("Schema executed successfully!")
    
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;")
    tables = [t[0] for t in cur.fetchall()]
    print("Tables now active in public schema:")
    for t in tables:
        print(f"  - {t}")
        
    conn.close()

if __name__ == "__main__":
    run_migration()

