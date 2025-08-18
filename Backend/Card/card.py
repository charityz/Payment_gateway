from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from bson import ObjectId
from Backend.database import users_collection
from Backend.Schemas.schemas import CardModel


auth_router = APIRouter()


@auth_router.post("/api/v1/add_card")
async def add_card(card: CardModel):
    # Find the user
    user = await users_collection.find_one({"_id": ObjectId(card.user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    print("name", user)
    print("name", card.user_id)
    
    await users_collection.update_one(
        {"_id": ObjectId(card.user_id)},
        {"$push": {
            "cards": {
                "card_number": card.card_number,
                "expiry_date": card.expiry_date,
                "cvv": card.cvv,
                "name_on_card": card.name_on_card
            }
        }}
    )
    return {"message": "Card added successfully"}
