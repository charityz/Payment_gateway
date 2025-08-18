from fastapi import APIRouter, HTTPException, Response, Request, BackgroundTasks
from Backend.utils import create_access_token, hash_password, send_email_with_default_password, generate_access_code, generate_reference
from passlib.context import CryptContext 
from Backend.database import users_collection, EXPIRY_MINUTES, SECRET_KEY, encrypt_pending_data, decrypt_pending_data
from Backend.Schemas.schemas import *
from datetime import datetime
from datetime import datetime, timedelta
from Backend.Emails_otp.email import generate_otp, send_otp_email
import json
import traceback


auth_router = APIRouter()

@auth_router.post("/api/v1")

# REGISTRATION 
@auth_router.post("/api/v1/register_user")
async def register_user(user: UserRegister, response: Response, background_task: BackgroundTasks):
    try:
        print("Starting registration...")

        # Validate required fields
        if not all([
            user.first_name.strip(),
            user.last_name.strip(),
            user.email.strip(),
            user.password.strip(),
            user.country.strip(),
            user.business_name.strip()
        ]):
            raise HTTPException(status_code=400, detail="All fields are required")

        # Check if user already exists
        existing = await users_collection.find_one({"email": user.email.lower()})
        if existing:
            raise HTTPException(status_code=400, detail="User already exists")

        # Prepare pending registration data
        hashed_pw = hash_password(user.password)
        otp_code = await generate_otp()

        pending_data = {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email.lower(),
            "password": hashed_pw, 
            "defaultPassword": "",
            "phone_number": user.phone_number,
            "business_name": user.business_name,
            "country":user.country,
            "otp": otp_code,
            "otp_created_at": datetime.now().isoformat(),
            "created_at": datetime.now().isoformat()
        }

        print("Pending data ready:", pending_data)

        expiry_minutes = int(EXPIRY_MINUTES)

        # Store in HttpOnly cookie
        encrypted_data = encrypt_pending_data(pending_data)
        response.set_cookie(
            key="pending_registration",
            value=encrypted_data,
            httponly=True,
            secure=False,  
            samesite="lax",
            max_age=600
        )

        # await send_otp_email(user.email, otp_code) 
        background_task.add_task(send_otp_email, user.email, otp_code)
        if not background_task:
            raise HTTPException(status_code=500, detail="Failed to send OTP email. Please try again.")

        return {"message": "OTP sent. Please verify to complete registration."}

    except HTTPException:
        raise
    except Exception as e:
        print(f"Registration error: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Registration failed")


# VERIFY REGISTRATION OTP
@auth_router.post("/api/v1/verify_registration_otp")
async def verify_registration_otp(data: dict, request: Request, response: Response):
    otp_code = data.get("otp")
    if not otp_code:
        raise HTTPException(status_code=400, detail="OTP is required")

    # Get encrypted cookie
    token = request.cookies.get("pending_registration")
    if not token:
        raise HTTPException(status_code=400, detail="No pending registration found")

    try:
        # Decrypt cookie (auto-expire after 10 minutes)
        pending_data = decrypt_pending_data(token, max_age_seconds=600)
    except Exception:
        raise HTTPException(status_code=400, detail="Pending registration expired or invalid")

    # Validate OTP
    if pending_data.get("otp") != otp_code:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    # Save user to DB
    await users_collection.insert_one({
        "email": pending_data["email"],
        "first_name": pending_data["first_name"],
        "last_name": pending_data["last_name"],
        "phone_number": pending_data["phone_number"],
        "password": pending_data["password"], 
        "defaultPassword": pending_data["defaultPassword"], 
        "business_name": pending_data["business_name"], 
        "country": pending_data["country"], 
        "created_at": datetime.now(),
        "is_verified": True
    })

    # Clear cookie
    response.delete_cookie("pending_registration")

    return {"message": "Registration completed successfully"}




# SIGN-IN
@auth_router.post("/api/v1/signin")
async def signin(user: SignIn):
    try:
        db_user = await users_collection.find_one({"email": user.email})
        if not db_user:
            raise HTTPException(status_code=401, detail="Invalid email")

        otp_code = await generate_otp()
        otp_created_at = datetime.now()

        print("otp generated", otp_code)
        
        await users_collection.update_one(
            {"_id": db_user["_id"]},
            {"$set": {
                "otp": otp_code,
                "otp_verified": False,
                "otp_created_at": otp_created_at
            }}
        )

        email_sent = await send_otp_email(user.email, otp_code)

        # if not email_sent:
        #     raise HTTPException(status_code=500, detail="Failed to send OTP email. Please try again.")

        return {"message": "OTP sent to your email"}

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Signin failed: {str(e)}")



# VERIFY SIGN IN OTP 
@auth_router.post("/api/v1/verify_otp")
async def verify_login_otp(data: dict, response: Response):
    email = data.get("email")
    otp_code = data.get("otp")

    if  not otp_code:
        raise HTTPException(status_code=400, detail="Email and OTP are required")

    user = await users_collection.find_one({"email": email})
    if not user or not user.get("otp"):
        raise HTTPException(status_code=404, detail="No pending login OTP found")

    # Check expiry
    if datetime.now() - user["otp_created_at"] > timedelta(minutes=EXPIRY_MINUTES):
        await users_collection.update_one(
            {"_id": user["_id"]},
            {"$unset": {"otp": "", "otp_created_at": None}}
        )
        raise HTTPException(status_code=400, detail="OTP expired")

    # Check match
    if user["otp"] != otp_code:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    # OTP is valid — clear it and log the user in
    await users_collection.update_one(
        {"_id": user["_id"]},
        {"$unset": {"otp": "", "otp_created_at": None}}
    )

    # Generate and set access token
    token_data = {"email": user["email"]}
    access_token = create_access_token(token_data)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=3600
    )

    return {
        "message": "Login successful",
        "email": email,
        "id": str(user["_id"]),
        "name": user.get("last_name", "")
        
    }




# DEFAULT PASSWORD
@auth_router.post("/api/v1/default_password")
async def default_password(data: dict):
    email = data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.get("using_default_password") is True:
        return {"message": "Default password has already been sent to this email."}

    # Generate temporary password (not hashed so they can see it in email)
    default_password = await generate_otp()

    # Store hashed version in DB, send plain version via email
    await users_collection.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "defaultPassword": default_password,
                "using_default_password": True,
                "password_created_at": datetime.now()
            }
        }
    )

    await send_email_with_default_password(email, default_password, EXPIRY_MINUTES)

    return {"message": "Default password sent to your email."}



@auth_router.post("/api/v1/verify_default_password")
async def verify_default_password(data: dict, response: Response):
    email = data.get("email")
    defaultPassword = data.get("defaultPassword")

    if not email or not defaultPassword:
        raise HTTPException(status_code = 400, detail="Email and default password are required")

    user = await users_collection.find_one({"email": email})
    if not user or not user.get("defaultPassword"):
        raise HTTPException(status_code = 404, detail="User not found or no default password set")


    # Optional: expiration logic
    if datetime.now() - user["password_created_at"] > timedelta(minutes=EXPIRY_MINUTES):
        await users_collection.update_one(
        {"_id": user["_id"]},
        {"$unset": {"defaultPassword": "", "password_created_at": ""}}
    )
        print ("minuts", EXPIRY_MINUTES)
        raise HTTPException(status_code = 400, detail="Default password expired")

    if user["defaultPassword"] != defaultPassword:
        raise HTTPException(status_code = 400, detail="Invalid default password")

    # Mark that they passed verification
    await users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"using_default_password": True}}
    )

    # Issue a short-lived access token
    token_data = {"email": user["email"]}
    access_token = create_access_token(token_data)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=120
    )

    return {
        "message": "Default password verified successfully. Please set your new password.",
        "email": email
    }



