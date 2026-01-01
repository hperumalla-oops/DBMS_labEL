from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel , EmailStr  , Field
from typing_extensions import Annotated
import psycopg2
from psycopg2.extras import RealDictCursor
import uuid
import datetime
import random

app = FastAPI()

# Enable CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Connection using 127.0.0.1 to avoid IPv6 auth issues
def get_db_connection():
    return psycopg2.connect(
        dbname="finance",
        user="postgres",
        password="Nsa2s1b77!",
        host="127.0.0.1",
        port="5432"
    )

# --- Data Models ---

Username = Annotated[str, Field(min_length=3, max_length=20)]
Name = Annotated[str, Field(min_length=2)]
Password = Annotated[str, Field(min_length=8)]
Note = Annotated[str, Field(max_length=255)]
Month = Annotated[str , Field(pattern=r"^\d{4}-(0[1-9]|1[0-2])$",description="Month in YYYY-MM format")]

class UserSignup(BaseModel):
    username: Username
    name: Name
    email: EmailStr
    password: Password

class BudgetSetup(BaseModel):
    userid: str
    category_name: Name
    limit_amount: int = Field(gt=0)
    month: Month



class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ExpenseAdd(BaseModel):
    userid: str
    catid: str
    amount: int = Field(gt=0, lt=1_000_000)
    note: Note


# --- API Endpoints ---

@app.post("/create-account")
def create_account(user: UserSignup):
    conn = get_db_connection()
    print("doe")
    cur = conn.cursor()
    print("doe1")
    try:
        print(user.username, user.name, user.email, user.password)
        cur.execute(
            "INSERT INTO user_details (userid, name, email, password) VALUES (%s, %s, %s, %s)",
            (user.username, user.name, user.email, user.password)
        )
        
        
        conn.commit()
        print(f"!!! SUCCESS: User {user.name} inserted with ID {user.username} !!!")
        return {"userid": user.username, "message": "Success"}
    except Exception as e:
        conn.rollback()
        print(f"SQL Error Detail: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@app.post("/login")
def login(credentials: UserLogin):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    try:
        # Validate user credentials [cite: 99]
        cur.execute(
            "SELECT userid, name FROM user_details WHERE email = %s AND password = %s",
            (credentials.email, credentials.password)
        )
        user = cur.fetchone()
        if user:
            return {"status": "success", "userid": user['userid'], "name": user['name']}
        else:
            raise HTTPException(status_code=401, detail="Invalid email or password")
    finally:
        cur.close()
        conn.close()


@app.get("/categories")
def get_categories():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM category")
    categories = cur.fetchall()
    cur.close()
    conn.close()
    return categories


@app.post("/new-budget")
def new_budget(data: dict):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        # Check if budget already exists for this month
        cur.execute(
            "SELECT 1 FROM budget WHERE userid = %s AND month = %s",
            (data['userid'], data['month'])
        )
        if cur.fetchone():
            raise HTTPException(400, "Budget already exists for this month")

        # Create budget
        new_budget_id = random.randint(10000, 99999)
        cur.execute(
            """
            INSERT INTO budget (budgetid, userid, month)
            VALUES (%s, %s, %s)
            """,
            (new_budget_id, data['userid'], data['month'])
        )

        # Clone categories from previous month (optional but 🔥)
        cur.execute("""
            INSERT INTO category (categoryid, name, type, budgetid, amount_spent)
            SELECT
                substr(gen_random_uuid()::text, 1, 20),
                name,
                type,
                %s,
                0
            FROM category
            WHERE budgetid = (
                SELECT budgetid FROM budget
                WHERE userid = %s
                ORDER BY month DESC
                LIMIT 1
            )
        """, (new_budget_id, data['userid']))

        conn.commit()
        return {"status": "created"}

    except Exception as e:
        conn.rollback()
        raise HTTPException(500, str(e))
    finally:
        cur.close()
        conn.close()


@app.get("/dashboard/{userid}")
def dashboard(userid: str):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute(""" SELECT
    c.categoryid,
    c.name,
    c.amount_spent,
    b.limit_amount
FROM category c
JOIN budget b ON c.budgetid = b.budgetid
WHERE b.userid = %s;
""", (userid,))

    data = cur.fetchall()
    cur.close()
    conn.close()
    return data

@app.post("/new-budget")
def new_budget(data: BudgetSetup):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        # Check if budget already exists for this month
        cur.execute(
            "SELECT 1 FROM budget WHERE userid = %s AND month = %s",
            (data['userid'], data['month'])
        )
        if cur.fetchone():
            raise HTTPException(400, "Budget already exists for this month")

        # Create budget
        new_budget_id = random.randint(10000, 99999)
        cur.execute(
            """
            INSERT INTO budget (budgetid, userid, month)
            VALUES (%s, %s, %s)
            """,
            (new_budget_id, data['userid'], data['month'])
        )

        # Clone categories from previous month (optional but 🔥)
        cur.execute("""
            INSERT INTO category (categoryid, name, type, budgetid, amount_spent)
            SELECT
                substr(gen_random_uuid()::text, 1, 20),
                name,
                type,
                %s,
                0
            FROM category
            WHERE budgetid = (
                SELECT budgetid FROM budget
                WHERE userid = %s
                ORDER BY month DESC
                LIMIT 1
            )
        """, (new_budget_id, data['userid']))

        conn.commit()
        return {"status": "created"}

    except Exception as e:
        conn.rollback()
        raise HTTPException(500, str(e))
    finally:
        cur.close()
        conn.close()


@app.get("/dashboard/{userid}/{month}")
def dashboard(userid: str, month: str):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute("""
        SELECT
            c.categoryid,
            c.name,
            c.amount_spent,
            b.month
        FROM category c
        JOIN budget b ON c.budgetid = b.budgetid
        WHERE b.userid = %s AND b.month = %s
    """, (userid, month))

    data = cur.fetchall()
    cur.close()
    conn.close()
    return data


@app.post("/set-budget")
def set_budget(data: BudgetSetup):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        # 1. Create Budget entry first (Required by your foreign key constraints)
        # Note: budgetid is integer in your schema
        import random
        new_budget_id = random.randint(1000, 99999) 
        
        cur.execute(
    "INSERT INTO budget (budgetid, amount_spent, month, limit_amount, userid) VALUES (%s, %s, %s, %s, %s)",
    (new_budget_id, 0, data.month, data.limit_amount, data.userid)
)

        # 2. Create Category entry linked to that budget [cite: 35, 135]
        new_cat_id = str(uuid.uuid4())[:20]
        cur.execute(
            "INSERT INTO category (categoryid, name, type, budgetid) VALUES (%s, %s, %s, %s)",
            (new_cat_id, data.category_name, "major", new_budget_id)
        )
        
        conn.commit()
        print(f"!!! BUDGET SET: {data.category_name} for User {data.userid} !!!")
        return {"status": "Budget and Category initialized"}
    except Exception as e:
        conn.rollback()
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

# Prediction logic for demo [cite: 104, 203]
@app.get("/prediction/{userid}")
def get_prediction(userid: str):
    # This matches the 'prediction' table in your schema
    return {
        "predicted_amount": 5000,
        "confidence_score": "High",
        "insight": "Based on last month, expect higher spend in Food."
    }

@app.post("/add-expense")
def add_expense(data: ExpenseAdd):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        # 1. Generate Expense ID
        eid = str(uuid.uuid4())[:20]

        # 2. Insert expense record
        cur.execute(
            """
            INSERT INTO expense (expenseid, catid, userid, amount, date, note)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                eid,
                data['catid'],
                data['userid'],
                data['amount'],
                datetime.date.today(),
                data['note']
            )
        )

        # 3. Update ONLY the category spent amount
        cur.execute(
            """
            UPDATE category
            SET amount_spent = amount_spent + %s
            WHERE categoryid = %s
            """,
            (data['amount'], data['catid'])
        )

        conn.commit()
        return {"status": "success"}

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()






if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)