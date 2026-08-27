from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from app.core.database import get_db
from app.core.security import get_optional_user
from app.models.inquiry import InquiryCreate, InquiryOut

router = APIRouter(prefix="/api/inquiries", tags=["Inquiries"])

@router.post("", response_model=InquiryOut)
async def create_inquiry(
    inquiry_in: InquiryCreate,
    current_user=Depends(get_optional_user),
    db=Depends(get_db)
):
    # Check honeypot for anti-spam
    if inquiry_in.honeypot:
        # Silently succeed or throw error for bots
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Spam detected")

    if not ObjectId.is_valid(inquiry_in.property_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid property ID format")

    prop = await db.properties.find_one({"_id": ObjectId(inquiry_in.property_id)})
    if not prop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")

    user_id_str = current_user["id"] if current_user else None
    name = current_user["name"] if current_user else inquiry_in.name
    email = current_user["email"] if current_user else inquiry_in.email

    now = datetime.utcnow()
    inquiry_doc = {
        "property_id": inquiry_in.property_id,
        "agent_id": str(prop.get("agent_id", "")),
        "user_id": user_id_str,
        "name": name,
        "email": email,
        "phone": inquiry_in.phone,
        "message": inquiry_in.message,
        "status": "new",
        "created_at": now
    }

    result = await db.inquiries.insert_one(inquiry_doc)
    
    return InquiryOut(
        id=str(result.inserted_id),
        property_id=inquiry_in.property_id,
        property_title=prop.get("title", ""),
        agent_id=str(prop.get("agent_id", "")),
        user_id=user_id_str,
        name=name,
        email=email,
        phone=inquiry_in.phone,
        message=inquiry_in.message,
        status="new",
        created_at=now
    )
