from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from itsdangerous import URLSafeTimedSerializer
import os

load_dotenv()
# load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")

EMAIL_PORT = os.getenv("EMAIL_PORT")
EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_FROM = os.getenv("EMAIL_FROM")
EMAIL_PASSWORD = os.getenv("PASSKEY_EMAIL_PASSWORD")


EXPIRY_MINUTES = int(os.getenv("EXPIRY_MINUTES"))


# load_dotenv()
# load_dotenv()
MONGO_DB_URI = os.getenv("MONGO_DB_URI")

client =  AsyncIOMotorClient(MONGO_DB_URI)
db = client["paymentgateway"]
users_collection = db["users"]
payments_collection = db["payments"]
make_payments_collection = db["Make_payments"]
notifications_collection = db["Notifications"]
transactions_collection = db["transactions"]

if client:
    print("mongodb connected")
else:
    print("failed to connect to mongodb")




# Use a secret key from your env file
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
COOKIE_SALT = "pending-registration-salt"

serializer = URLSafeTimedSerializer(SECRET_KEY)

def encrypt_pending_data(data: dict) -> str:
    """Encrypt & sign data for storing in cookie."""
    return serializer.dumps(data, salt=COOKIE_SALT)

def decrypt_pending_data(token: str, max_age_seconds: int = 600) -> dict:
    """Decrypt & verify signed cookie data (with expiry)."""
    return serializer.loads(token, salt=COOKIE_SALT, max_age=max_age_seconds)


