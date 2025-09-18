from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, APIRouter, Query
from Backend.Routes import auth
from Backend.Card import card
from Backend.makePayment import makepayment, generate_paymentId
from Backend.Routes.auth import *
from Backend.Middleware import *
from Backend.Middleware.middleware import *
from fastapi.staticfiles import StaticFiles
import os




app = FastAPI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# backend static
backend_static_dir = os.path.join(BASE_DIR, "static")
if os.path.isdir(backend_static_dir):
    app.mount("/static", StaticFiles(directory=backend_static_dir), name="static")

# frontend folder
FRONTEND_DIR = os.path.join(BASE_DIR, "..", "frontend")
if os.path.isdir(FRONTEND_DIR):
    app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")

# frontend/.well-known
WELL_KNOWN_DIR = os.path.join(FRONTEND_DIR, ".well-known")
if os.path.isdir(WELL_KNOWN_DIR):
    app.mount("/.well-known", StaticFiles(directory=WELL_KNOWN_DIR), name="well_known")
    


origins = [
    "https://payment-gateway-3.onrender.com",
    'https://payverge.netlify.app',
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or ["*"] to allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(JWTMiddleware)




app.include_router(auth.auth_router)
app.include_router(card.auth_router)
app.include_router(makepayment.auth_router)
app.include_router(generate_paymentId.auth_router)
# app.include_router(notifications.auth_router)


auth_router = APIRouter()

# @auth_router.post("/api/v1")


@auth_router.get("/")
async def root():
    return {"message": "FastAPI is running"}    
 

# app = FastAPI()
# # app.mount("/static", StaticFiles(directory="static"), name="static" )

# # BASE_DIR = r"C:\Users\HP\Desktop\Payment_gateway\Backend"
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")

# FRONTEND_DIR = os.path.join(BASE_DIR, "..", "frontend")
# if os.path.isdir("frontend"):
#     app.mount("/static", StaticFiles(directory="frontend"), name="static")

# app.mount(
#     "/.well-known",
#     StaticFiles(directory="frontend/.well-known"),
#     name="well_known"
# )


# /static/.well-known/appspecific/com.chrome.devtools.json
# frontend/.well-known/appspecific/com.chrome.devtools.json



# activities = [
#     {"id": 1, "name": "Payment Processed", "status": "Success", "date": "2025-08-18"},
#     {"id": 2, "name": "Transfer Initiated", "status": "Pending", "date": "2025-08-17"},
#     {"id": 3, "name": "Refund Completed", "status": "Pending", "date": "2025-08-16"},
#     {"id": 4, "name": "allpayments Processed", "status": "Success", "date": "2025-08-18"},
#     {"id": 5, "name": "retrieved Initiated", "status": "Pending", "date": "2025-08-17"},
#     {"id": 6, "name": "reversed Completed", "status": "Failed", "date": "2025-08-16"},
#     {"id": 7, "name": "Paymentee Processed", "status": "Success", "date": "2025-08-18"},
#     {"id": 8, "name": "Transferee Initiated", "status": "Pending", "date": "2025-08-17"},
#     {"id": 9, "name": "Refundeee Completed", "status": "Failed", "date": "2025-08-16"},
#     {"id": 10, "name": "Payments Processed", "status": "Success", "date": "2025-08-18"},
#     {"id": 11, "name": "Transfers Initiated", "status": "Pending", "date": "2025-08-17"},
#     {"id": 12, "name": "Refunds Completed", "status": "Failed", "date": "2025-08-16"},
# ]

# transactions = [
#     {"id": 1, "type": "card", "amount": 500, "date": "2025-08-17"},
#     {"id": 2, "type": "card", "amount": 200, "date": "2025-08-17"},
#     {"id": 3, "type": "Transfer", "amount": 350, "date": "2025-08-18"},
#     {"id": 4, "type": "wallet", "amount": 800, "date": "2025-08-18"},
#     {"id": 5, "type": "card", "amount": 500, "date": "2025-08-17"},
#     {"id": 6, "type": "card", "amount": 200, "date": "2025-08-17"},
#     {"id": 7, "type": "Transfer", "amount": 350, "date": "2025-08-18"},
#     {"id": 8, "type": "wallet", "amount": 800, "date": "2025-08-18"},
# ]




# @app.get("/api/v1/transactions")
# def get_transactions(page: int = 1, limit: int = 3):
#     start = (page - 1) * limit
#     end = start + limit
#     return {
#         "transactions": transactions[start:end],
#         "total": len(transactions),
#         "page": page,
#         "limit": limit
#     }



# @app.get("/api/v1/activities")
# def get_activities(page: int = Query(1, ge=1), limit: int = Query(3, ge=1)):
#     reversed_activites = list(reversed(activities))
#     start = (page - 1) * limit
#     end = start + limit
#     has_next=end < len(activities)
#     has_prev = page < 1
#     data = reversed_activites[start:end]
#     prev_page = page - 1 if has_prev else 0
    
#     next_page = page + 1 if has_next else 0
  

#     return {
#         "page": page,
#         "limit": limit,
#         "total": len(activities),
#         "activities": data,
#         "prev_page": prev_page,
#         "next_page": next_page,
#         "has_next": has_next,
#         "has_prev": has_prev,
#         "start_no": start,
#         "end_no": end
#     }






