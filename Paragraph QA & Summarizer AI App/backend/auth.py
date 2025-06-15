from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel, EmailStr
import sqlite3, hashlib, os, random, string, time, smtplib, re
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from db import get_connection

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = "supersecretkey"  # Replace in production
ALGORITHM = "HS256"

# ========== Models ==========

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str
    otp: str

class UserLogin(BaseModel):
    username: str
    password: str

class OTPRequest(BaseModel):
    email: EmailStr

class PasswordReset(BaseModel):
    email: EmailStr
    new_password: str

class DeleteAccount(BaseModel):
    username: str
    password: str

# ========== Helpers ==========

def hash_password(password, salt=None):
    if salt is None:
        salt = os.urandom(16)
    else:
        salt = bytes.fromhex(salt)
    pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)
    return salt.hex() + pwd_hash.hex()

def verify_password(stored_hash, provided_password):
    salt = stored_hash[:32]
    return hash_password(provided_password, salt)[32:] == stored_hash[32:]

def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))

def create_access_token(data: dict, expires_in: int = 3600):
    payload = data.copy()
    payload.update({"exp": time.time() + expires_in})
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def get_user_from_db(username):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT username, password_hash FROM users WHERE username = ?", (username,))
    row = cur.fetchone()
    conn.close()
    if row:
        return {"username": row[0], "hashed_password": row[1]}
    return None

def delete_user_from_db(username):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM users WHERE username = ?", (username,))
    conn.commit()
    conn.close()

def is_password_strong(password: str) -> bool:
    if len(password) < 8:
        return False
    if not re.search(r'[A-Z]', password):
        return False
    if not re.search(r'[a-z]', password):
        return False
    if not re.search(r'\d', password):
        return False
    if not re.search(r'[^A-Za-z0-9]', password):
        return False
    return True

# In-memory OTP store
otp_store = {}

def send_email(to_email, subject, body):
    SMTP_SERVER = "smtp.gmail.com"
    SMTP_PORT = 587
    SMTP_USERNAME = "omerfaisal701@gmail.com"
    SMTP_PASSWORD = "hbph loho gepd qudq"
    FROM_EMAIL = SMTP_USERNAME

    msg = MIMEMultipart()
    msg['From'] = FROM_EMAIL
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Email error: {e}")
        return False

# ========== Routes ==========

@router.post("/request-otp")
def request_otp(data: OTPRequest):
    otp = generate_otp()
    expiry = time.time() + 300
    otp_store[data.email] = (otp, expiry)
    body = f"Your OTP is: {otp}. Valid for 5 minutes."
    success = send_email(data.email, "Your OTP Code", body)
    return {"success": success, "message": "OTP sent" if success else "Failed to send OTP"}

@router.post("/signup")
def signup(user: UserRegister):
    if not is_password_strong(user.password):
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters and include uppercase, lowercase, digit, and special character."
        )

    if user.email not in otp_store:
        raise HTTPException(status_code=400, detail="No OTP requested for this email.")

    stored_otp, expiry = otp_store[user.email]
    if time.time() > expiry:
        del otp_store[user.email]
        raise HTTPException(status_code=400, detail="OTP expired.")
    if user.otp != stored_otp:
        raise HTTPException(status_code=400, detail="Invalid OTP.")

    conn = get_connection()
    cur = conn.cursor()

    # 🔍 Proactively check if username or email already exist
    cur.execute("SELECT username, email FROM users WHERE username = ? OR email = ?", (user.username, user.email))
    existing = cur.fetchone()
    if existing:
        if existing[0] == user.username:
            conn.close()
            raise HTTPException(status_code=400, detail="Username already taken")
        if existing[1] == user.email:
            conn.close()
            raise HTTPException(status_code=400, detail="Email already registered")

    del otp_store[user.email]
    password_hash = hash_password(user.password)

    try:
        cur.execute("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
                    (user.username, user.email, password_hash))
        conn.commit()
        return {"success": True, "message": "User registered successfully"}
    finally:
        conn.close()


@router.post("/login")
def login(user: UserLogin):
    user_record = get_user_from_db(user.username)
    if user_record and verify_password(user_record["hashed_password"], user.password):
        token = create_access_token(data={"sub": user.username})
        return {"access_token": token, "token_type": "bearer", "success": True}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@router.post("/reset-password")
def reset_password(data: PasswordReset):
    if not is_password_strong(data.new_password):
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters and include uppercase, lowercase, digit, and special character."
        )
    password_hash = hash_password(data.new_password)
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("UPDATE users SET password_hash = ? WHERE email = ?", (password_hash, data.email))
    conn.commit()
    success = cur.rowcount > 0
    conn.close()
    return {"success": success, "message": "Password reset successful" if success else "Email not found"}

@router.post("/delete-account")
def delete_account(data: DeleteAccount):
    user = get_user_from_db(data.username)
    if not user or not verify_password(user["hashed_password"], data.password):
        raise HTTPException(status_code=403, detail="Re-authentication failed")
    delete_user_from_db(data.username)
    return {"success": True, "message": "Account deleted"}

@router.post("/check-user")
def check_user(data: dict = Body(...)):
    username = data.get("username")
    email = data.get("email")
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT 1 FROM users WHERE username = ? OR email = ?", (username, email))
    exists = cur.fetchone() is not None
    conn.close()
    return {"available": not exists}
