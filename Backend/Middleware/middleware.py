from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from Backend.utils import verify_token
from Backend.Routes.auth import users_collection


class JWTMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.method == "OPTIONS":
            return await call_next(request)
        # public_paths = ["/api/v1/signin","/api/v1/add_card","/api/v1/generate_payment", "/api/v1/register_user", "/api/v1/verify_otp", "/api/v1/verify_registration_otp",  "/api/v1/default_password", "/api/v1/verify_default_password", "/api/v1/activities", "/api/v1/transactions","/api/v1/make_payment","/api/v1/get_payment","/api/v1/show_payment" ]
        public_paths = ["/api/v1/signin",   "/api/v1/register_user", "/api/v1/verify_otp", "/api/v1/verify_registration_otp","/api/v1/show_payment", "/api/v1/get_payment"]
        if request.url.path in public_paths:
            return await call_next(request)
        
        skip_paths = [
            "/favicon.ico",
            "/.well-known",
            "/static"
        ]
        if any(request.url.path.startswith(path) for path in skip_paths):
            return await call_next(request)


        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse(status_code=401, content={"detail": "Missing or invalid token"})

        token = auth_header.split(" ")[1]
        payload = verify_token(token)
        if not payload:
            return JSONResponse(status_code=401, content={"detail": "Invalid token"})

        # # Fetch user from DB
        # user = await users_collection.find_one({"email": payload["email"]})
        # if not user or not user.get("otp_verified"):
        #     return JSONResponse(status_code=403, content={"detail": "OTP not verified"})

        request.state.user = payload
        return await call_next(request)




# class AuthMiddleware(BaseHTTPMiddleware):
#     async def dispatch(self, request: Request, call_next):
#         # Paths to skip authentication
#         skip_paths = [
#             "/favicon.ico",
#             "/.well-known/appspecific/com.chrome.devtools.json",
#             "/static"  
#         ]

#         if any(request.url.path.startswith(path) for path in skip_paths):
#             return await call_next(request)

#         # Your existing auth check
#         auth_header = request.headers.get("Authorization")
#         if not auth_header:
#             return JSONResponse({"detail": "Unauthorized"}, status_code=401)

#         # Continue normally
#         response = await call_next(request)
#         return response
