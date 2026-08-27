from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, EmailStr

class InquiryStatus(str, Enum):
    new = "new"
    contacted = "contacted"
    closed = "closed"

class InquiryCreate(BaseModel):
    property_id: str
    name: str
    email: EmailStr
    phone: str
    message: str
    honeypot: Optional[str] = None  # anti-spam protection

class InquiryOut(BaseModel):
    id: str
    property_id: str
    property_title: Optional[str] = None
    agent_id: str
    user_id: Optional[str] = None
    name: str
    email: EmailStr
    phone: str
    message: str
    status: InquiryStatus = InquiryStatus.new
    created_at: datetime

    class Config:
        from_attributes = True
