
# @auth_router.get("/api/v1/transactions")
# async def get_user_transactions(request: Request):
#     payload = request.state.user 
#     user_id = payload.get("id")

#     if not user_id or not ObjectId.is_valid(user_id):
#         raise HTTPException(status_code=400, detail="Invalid user_id in token")

#     # Fetch transactions for this user
#     transactions = await transactions_collection.find(
#         {"user_id": user_id},
#         {"_id": 0}
#     ).to_list(length=None)

#     return {"transactions": transactions}




# @auth_router.get("/api/v1/transactions/history", response_model=PaginatedTransactions)
# async def get_transaction_history(
#     page: int = Query(1, ge=1),
#     page_size: int = Query(10, ge=1, le=50),
#     status: Optional[str] = Query(None),   # filter by status
#     search: Optional[str] = Query(None)    # filter by description/id
# ):
#     query = {}
#     if status:
#         query["status"] = status
#     if search:
#         query["$or"] = [
#             {"transaction_id": {"$regex": search, "$options": "i"}},
#             {"description": {"$regex": search, "$options": "i"}},
#         ]

#     total = await transactions_collection.count_documents(query)
#     cursor = transactions_collection.find(query).skip((page - 1) * page_size).limit(page_size)
#     results = await cursor.to_list(length=page_size)

#     return PaginatedTransactions(
#         total=total,
#         page=page,
#         page_size=page_size,
#         transactions=results
#     )


# transactions = [
#     {"id": 2, "type": "card", "amount": 200, "date": "2025-08-17"},
#     {"transaction_id": "TXN123","id": 1, "type": "card", "amount": 500, "date": "2025-08-17"},
#     {"id": 3, "type": "Transfer", "amount": 350, "date": "2025-08-18"},
#     {"id": 4, "type": "wallet", "amount": 800, "date": "2025-08-18"},
#     {"id": 5, "type": "card", "amount": 500, "date": "2025-08-17"},
#     {"id": 6, "type": "card", "amount": 200, "date": "2025-08-17"},
#     {"id": 7, "type": "Transfer", "amount": 350, "date": "2025-08-18"},
#     {"id": 8, "type": "wallet", "amount": 800, "date": "2025-08-18"},
# ]


# @auth_router.post("/api/v1/transaction/status", response_model=TransactionResponse)
# async def check_transaction_status(data: TransactionCheck):
#     # Search through the hardcoded list
#     transaction = next((t for t in transactions if t.get("transaction_id") == data.transaction_id), None)

#     if not transaction:
#         raise HTTPException(status_code=404, detail="Transaction not found")
    
#     # Use status if available, otherwise default to pending
#     status = transaction.get("status", "pending").lower()

#     if status not in ["success", "pending", "failed"]:
#         status = "pending" 
    
#     return {
#         "transaction_id": data.transaction_id,
#         "status": status
#     }




# @auth_router.get("/api/v1/transactions", response_model=PaginatedTransactions)
# async def get_transactions(page: int = 1, page_size: int = 10, token: str = Depends(oauth2_scheme)):
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         user_id: str = payload.get("id")
#         if not user_id:
#             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
#     except JWTError:
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

#     # Fetch only this user's transactions
#     skip = (page - 1) * page_size
#     cursor = transactions_collection.find({"user_id": user_id}).skip(skip).limit(page_size)
#     transactions = await cursor.to_list(length=page_size)

#     # Count total transactions for pagination
#     total = await transactions_collection.count_documents({"user_id": user_id})

#     return PaginatedTransactions(
#         total=total,
#         page=page,
#         page_size=page_size,
#         transactions=[
#             TransactionResponse(
#                 transaction_id=str(tx["_id"]),
#                 status=tx.get("status", "pending"),
#                 amount=tx.get("amount", 0.0),
#                 description=tx.get("description"),
#                 created_at=tx.get("created_at", "")
#             )
#             for tx in transactions
#         ]
#     )