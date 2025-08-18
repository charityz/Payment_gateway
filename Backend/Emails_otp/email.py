from email.message import EmailMessage
import aiosmtplib
import random
from datetime import datetime
from Backend.database import EMAIL_FROM, EMAIL_PASSWORD, EMAIL_HOST, EMAIL_PORT, EXPIRY_MINUTES




# EMAIL_PASSWORD = "your_app_password"  # Use app password, not your Gmail password

async def send_otp_email(receiver_email: str, otp: str):
    message = EmailMessage()
    message["From"] = EMAIL_FROM
    message["To"] = receiver_email
    message["Subject"] = "Your OTP Verification Code"

    message.set_content(f"Your OTP is: {otp}. It will expire in {EXPIRY_MINUTES} minutes.")

    try:
        await aiosmtplib.send(
            message,
            hostname = EMAIL_HOST,
            port = EMAIL_PORT,
            start_tls = True,
            username = EMAIL_FROM,
            password = EMAIL_PASSWORD
        )
        print("Connecting to:", EMAIL_HOST, EMAIL_PORT)

        return True
    except Exception as e:
        print("Email send failed:", e)
        return False



async def generate_otp():
    return str(random.randint(100000, 999999))



