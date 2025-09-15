from fastapi import FastAPI, APIRouter, HTTPException, Response, Request, Query
from Backend.utils import generate_access_code, generate_reference
from Backend.database import payments_collection, make_payments_collection
from fastapi.responses import HTMLResponse, FileResponse
import os
from pathlib import Path
from uuid import uuid1
# from Backend.Emails_otp.email import generate_otp, send_otp_email


auth_router = APIRouter()

# BASE_DIR = r"C:\Users\HP\Desktop\Payment_gateway\Backend"

BASE_DIR = Path(__file__).resolve().parent.parent

url = "https://payment-gateway-3.onrender.com/api/v1/show_payment"


@auth_router.post("/api/v1")

@auth_router.post("/api/v1/generate_payment")
async def generate_payment(request: Request):
    try:
        req = await request.body()
        req = eval(req.decode())
    
        
        payment_id = str(uuid1())
        access_code = generate_access_code()
        reference_code = generate_reference()
        data={}

        data["payment_id"] = payment_id
        data["access_code"] = access_code
        data["reference_code"] = reference_code
        data["email"] = req["email"]
        data["amount"] = req["amount"]
        data["owner_email"] = req["owner_email"]
        
        await make_payments_collection.insert_one(data)
        
        payment_link = f"{url}?id={payment_id}"

        # # send link via email
        # # await send_payment_link(data.email, payment_link, data.amount)

        return {
        "message": "Payment link generated",
        "payment_link": payment_link,
       "access_code": access_code,
        "reference_code": reference_code, 
         }

    except KeyError:
        raise HTTPException(status_code=400, detail="Email and amount are required")
        # return {
        #     "error": "Email and amount are required"
        # }


@auth_router.get("/api/v1/get_payment")
async def get_payment(id:  str = Query(...)):
    payment = await make_payments_collection.find_one({"payment_id": id})
    
    if not payment: 
        raise HTTPException(status_code=404, detail= "Payment not found")
    
    return {
        "email": payment["email"],
        "amount": payment["amount"],
        "owner_email": payment["owner_email"]
    }



@auth_router.get("/api/v1/show_payment", response_class=HTMLResponse)
async def show_payment(id: str = Query(...)):
   
    # filePath = os.path.join(BASE_DIR, "static", "payment.html")
    
    filePath = BASE_DIR / "static" / "payment.html"
    # if not os.path.exists(filePath):
    if not filePath.exists():
        return HTMLResponse(content=f"<h1>Payment page not found for id={id}</h1>", status_code=404)
    
    return FileResponse(filePath)
    # with open(filePath, "r", encoding="utf-8") as f:
    #     html_content = f.read()
        
    # return HTMLResponse(content=html_content)
        
    
    



    
  
