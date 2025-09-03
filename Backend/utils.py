# from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt 
import hashlib
import secrets
from Backend.database import *
from email.message import EmailMessage
import aiosmtplib
import random 
import string


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    hashed = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
    return salt + hashed.hex()

def verify_password(password: str, hashed_password: str) -> bool:
    salt = hashed_password[:32]
    stored_hash = hashed_password[32:]
    new_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
    return new_hash.hex() == stored_hash


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now() + timedelta(minutes= int (ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def generate_reference():
    return "REF-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=10))

def generate_access_code():
    return "ACC-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=12))


# def verify_token(token: str):
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         return payload
#     except JWTError:
#         return None
    
    
def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("id")
        email: str = payload.get("email")

        if user_id is None or email is None:
            return None  # token is invalid if claims are missing

        return {
            "id": user_id,
            "email": email
        }

    except JWTError:
        return None
    
    
async def send_otp_email(receiver_email: str, otp: str):
    message = EmailMessage()
    message["From"] = EMAIL_FROM
    message["To"] = receiver_email
    message["Subject"] = "Your OTP Verification Code"
    message.set_content(f"Your OTP is: {otp}. It will expire in {EXPIRY_MINUTES} minutes.")

    try:
        print(f"[EMAIL] Connecting to {EMAIL_HOST}:{EMAIL_PORT} to send OTP to {receiver_email}...")
        await aiosmtplib.send(
            message,
            hostname=EMAIL_HOST,
            port=EMAIL_PORT,
            start_tls=True,
            username=EMAIL_FROM,
            password=EMAIL_PASSWORD,
            timeout=20  
        )
        print(f"[EMAIL] OTP email sent successfully to {receiver_email}")
        return True

    except aiosmtplib.SMTPConnectError as e:
        print(f"[EMAIL ERROR] Could not connect to SMTP server: {e}")
    except aiosmtplib.SMTPAuthenticationError as e:
        print(f"[EMAIL ERROR] Authentication failed: {e}")
    except Exception as e:
        print(f"[EMAIL ERROR] Unexpected error sending email to {receiver_email}: {e}")

    return False


async def send_email_with_default_password(receiver_email: str, default_password: str):
    message = EmailMessage()
    message["From"] = EMAIL_FROM
    message["To"] = receiver_email
    message["Subject"] = "Your Temporary Default Password"

    message.set_content(f"""
    Hello,

    Your default password is: {default_password}
    Please use this to change your password immediately.
    
    Your default password will expiry in {EXPIRY_MINUTES} minutes.

    Regards,
    Payverge
    """)

    try:
        await aiosmtplib.send(
            message,
            hostname=EMAIL_HOST,
            port=EMAIL_PORT,
            start_tls=True,
            username=EMAIL_FROM,
            password=EMAIL_PASSWORD
        )
        return True
    except Exception as e:
        print("Failed to send email:", e)
        return False








