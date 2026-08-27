from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token, get_current_user
from app.models.user import UserRegister, UserLogin, UserOut, TokenResponse

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/register", response_model=TokenResponse)
async def register(user_in: UserRegister, db=Depends(get_db)):
    # Check if email already exists
    existing = await db.users.find_one({"email": user_in.email.lower()})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    now = datetime.utcnow()
    user_doc = {
        "name": user_in.name,
        "email": user_in.email.lower(),
        "password_hash": get_password_hash(user_in.password),
        "phone": user_in.phone,
        "saved_properties": [],
        "created_at": now,
        "updated_at": now
    }
    
    result = await db.users.insert_one(user_doc)
    user_id_str = str(result.inserted_id)
    
    user_out = UserOut(
        id=user_id_str,
        name=user_doc["name"],
        email=user_doc["email"],
        phone=user_doc.get("phone"),
        saved_properties=[],
        created_at=now
    )
    
    token = create_access_token(data={"sub": user_id_str})
    return TokenResponse(access_token=token, token_type="bearer", user=user_out)

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db=Depends(get_db)):
    user = await db.users.find_one({"email": credentials.email.lower()})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    user_id_str = str(user["_id"])
    saved_props = [str(pid) for pid in user.get("saved_properties", [])]
    
    user_out = UserOut(
        id=user_id_str,
        name=user["name"],
        email=user["email"],
        phone=user.get("phone"),
        saved_properties=saved_props,
        created_at=user["created_at"]
    )
    
    token = create_access_token(data={"sub": user_id_str})
    return TokenResponse(access_token=token, token_type="bearer", user=user_out)

@router.get("/me", response_model=UserOut)
async def get_me(current_user=Depends(get_current_user)):
    saved_props = [str(pid) for pid in current_user.get("saved_properties", [])]
    return UserOut(
        id=current_user["id"],
        name=current_user["name"],
        email=current_user["email"],
        phone=current_user.get("phone"),
        saved_properties=saved_props,
        created_at=current_user["created_at"]
    )
