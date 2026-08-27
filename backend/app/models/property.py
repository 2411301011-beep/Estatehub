from datetime import datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field
from app.models.agent import AgentOut

class PropertyType(str, Enum):
    apartment = "apartment"
    villa = "villa"
    commercial = "commercial"

class ListingType(str, Enum):
    buy = "buy"
    rent = "rent"

class PriceUnit(str, Enum):
    total = "total"
    per_month = "per_month"

class PropertyStatus(str, Enum):
    active = "active"
    sold = "sold"
    rented = "rented"

class LocationSchema(BaseModel):
    city: str  # Gurgaon | Delhi | Noida | Mumbai
    address: str
    lat: Optional[float] = None
    lng: Optional[float] = None

class PropertyBase(BaseModel):
    title: str
    description: str
    property_type: PropertyType
    listing_type: ListingType
    price: float
    price_unit: PriceUnit = PriceUnit.total
    location: LocationSchema
    bedrooms: int
    bathrooms: int
    area_sqft: float
    amenities: List[str] = []
    images: List[str] = []
    agent_id: str
    verified: bool = True
    featured: bool = False
    status: PropertyStatus = PropertyStatus.active

class PropertyCreate(PropertyBase):
    pass

class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    property_type: Optional[PropertyType] = None
    listing_type: Optional[ListingType] = None
    price: Optional[float] = None
    price_unit: Optional[PriceUnit] = None
    location: Optional[LocationSchema] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    area_sqft: Optional[float] = None
    amenities: Optional[List[str]] = None
    images: Optional[List[str]] = None
    agent_id: Optional[str] = None
    verified: Optional[bool] = None
    featured: Optional[bool] = None
    status: Optional[PropertyStatus] = None

class PropertyOut(PropertyBase):
    id: str
    agent: Optional[AgentOut] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PropertyListResponse(BaseModel):
    items: List[PropertyOut]
    total: int
    page: int
    limit: int
    total_pages: int
