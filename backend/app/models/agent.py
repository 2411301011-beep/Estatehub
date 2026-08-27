from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class AgentBase(BaseModel):
    name: str
    photo_url: str
    agency: str
    phone: str
    email: str
    bio: str
    verified: bool = True
    rating: Optional[float] = 4.8
    listings_count: int = 0

class AgentCreate(AgentBase):
    pass

class AgentOut(AgentBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
