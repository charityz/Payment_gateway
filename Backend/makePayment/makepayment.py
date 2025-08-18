from fastapi import APIRouter, HTTPException
from Backend.Schemas.schemas import PaymentRequest

auth_router = APIRouter()



# @auth_router.post("/api/v1/make_payment")
# async def make_payment(data: PaymentRequest):
#     # Validate amount
#     if data.amount <= 0:
#         raise HTTPException(status_code=400, detail="Invalid payment amount.")

#     if data.method == "card":
        
#         if not (data.card_number and data.expiry and data.cvv):
#             raise HTTPException(status_code=400, detail="Card details are required.")
#         return {"status": "success", "message": "Card payment completed."}

#     elif data.method == "transfer":
#         if not data.account_number:
#             raise HTTPException(status_code=400, detail="Account number is required.")
       
#         return {"status": "success", "message": "Bank transfer initiated."}

#     elif data.method == "wallet":
#         if not data.wallet_id:
#             raise HTTPException(status_code=400, detail="Wallet ID is required.")
      
#         return {"status": "success", "message": "Wallet payment completed."}

#     else:
#         raise HTTPException(status_code=400, detail="Invalid payment method.")




@auth_router.post("/api/v1/make_payment")
async def make_payment(data: PaymentRequest):
  
    if data.amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid payment amount.")

    if data.method == "card":
        if not (data.card_number and data.expiry_date and data.cvv):
            raise HTTPException(status_code=400, detail="Card details are required.")
        return {"status": "success", "message": "Card payment completed."}

    elif data.method == "transfer":
        if not data.account_number:
            raise HTTPException(status_code=400, detail="Account number is required.")
        return {"status": "success", "message": "Bank transfer initiated."}

    elif data.method == "wallet":
        if not data.wallet_id:
            raise HTTPException(status_code=400, detail="Wallet ID is required.")
        return {"status": "success", "message": "Wallet payment completed."}

    else:
        raise HTTPException(status_code=400, detail="Invalid payment method.")