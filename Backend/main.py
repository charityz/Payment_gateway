from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, APIRouter
from Backend.Routes import auth
from Backend.Card import card
from Backend.makePayment import makepayment, generate_paymentId
from Backend.Routes.auth import *
from Backend.Middleware import *
from Backend.Middleware.middleware import *
from fastapi.staticfiles import StaticFiles
import os




app = FastAPI()
# app.mount("/static", StaticFiles(directory="static"), name="static" )

BASE_DIR = r"C:\Users\HP\Desktop\Payment_gateway\Backend"
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")


origins = [
    "http://127.0.0.1:5500",  # your frontend
    "http://localhost:5500",  # optional variant
    "http://127.0.0.1:3000",  # if React dev server
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # Only allow these origins
    allow_credentials=True,       # Important for cookies
    allow_methods=["*"],          # Allow all methods
    allow_headers=["*"],          # Allow all headers
)



app.add_middleware(JWTMiddleware)
app.include_router(auth.auth_router)
app.include_router(card.auth_router)
app.include_router(makepayment.auth_router)
app.include_router(generate_paymentId.auth_router)


auth_router = APIRouter()

@auth_router.post("/api/v1")



@auth_router.get("/")
async def root():
    return {"message": "FastAPI is running"}




