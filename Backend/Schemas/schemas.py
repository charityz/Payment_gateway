from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from pydantic import BaseModel
from typing import Literal, List
from datetime import datetime

class UserRegister(BaseModel):
    first_name: str = Field(..., min_length=1, description="First name is required")
    last_name: str = Field(..., min_length=1, description="Last name is required")
    email: EmailStr
    # OTP:Optional[str] = None
    defaultPassword: str =""
    phone_number: str
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")
    country: str
    business_name: str


class SignIn(BaseModel):
    email: EmailStr
    # password: str

# Payment request body
class PaymentRequest(BaseModel):
    method: Literal["card", "transfer", "wallet"]
    amount: float
    currency: str = "NGN"
    card_number: Optional[str] = None
    expiry_date: Optional[str] = None
    cvv: Optional[str] = None
    account_number: Optional[str] = None
    wallet_id: Optional[str] = None
    
    
    

users_db = {}
class CardModel(BaseModel):
    user_id: str
    card_number: str
    expiry_date: str
    cvv: str
    name_on_card: str
    

class GeneratePaymentId(BaseModel):
    email:  EmailStr
    amount: float
    access_code: str
    reference_code: str
    payment_id: int
    status: str = Field (default="pending")
    owner_email: EmailStr
    
class NotificationIn(BaseModel):
    user_id: str
    message: str
    type: str = "general"

class NotificationOut(NotificationIn):
    id: str
    status: str = "unread"
    created_at: datetime
   
    
# Your existing response model
class TransactionResponse(BaseModel):
    transaction_id: str
    status: Literal["success", "pending", "failed"]
    amount: float
    description: Optional[str] = None
    created_at: str

# Paginated response
class PaginatedTransactions(BaseModel):
    total: int
    page: int
    page_size: int
    transactions: List[TransactionResponse]