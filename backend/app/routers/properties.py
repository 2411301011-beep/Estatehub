from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from bson import ObjectId
from app.core.database import get_db
from app.core.security import verify_admin_key
from app.models.property import PropertyOut, PropertyCreate, PropertyUpdate, PropertyListResponse, PropertyType, ListingType, PropertyStatus
from app.models.agent import AgentOut

router = APIRouter(prefix="/api/properties", tags=["Properties"])

def format_agent(agent_doc) -> Optional[AgentOut]:
    if not agent_doc:
        return None
    return AgentOut(
        id=str(agent_doc["_id"]),
        name=agent_doc["name"],
        photo_url=agent_doc["photo_url"],
        agency=agent_doc["agency"],
        phone=agent_doc["phone"],
        email=agent_doc["email"],
        bio=agent_doc["bio"],
        verified=agent_doc.get("verified", True),
        rating=agent_doc.get("rating", 4.8),
        listings_count=agent_doc.get("listings_count", 0),
        created_at=agent_doc.get("created_at", datetime.utcnow())
    )

def format_property(prop, agent_doc=None) -> PropertyOut:
    return PropertyOut(
        id=str(prop["_id"]),
        title=prop["title"],
        description=prop["description"],
        property_type=prop["property_type"],
        listing_type=prop["listing_type"],
        price=prop["price"],
        price_unit=prop.get("price_unit", "total"),
        location=prop["location"],
        bedrooms=prop["bedrooms"],
        bathrooms=prop["bathrooms"],
        area_sqft=prop["area_sqft"],
        amenities=prop.get("amenities", []),
        images=prop.get("images", []),
        agent_id=str(prop["agent_id"]),
        agent=format_agent(agent_doc),
        verified=prop.get("verified", True),
        featured=prop.get("featured", False),
        status=prop.get("status", "active"),
        created_at=prop.get("created_at", datetime.utcnow()),
        updated_at=prop.get("updated_at", datetime.utcnow())
    )

@router.get("", response_model=PropertyListResponse)
async def get_properties(
    city: Optional[str] = Query(None, description="City name e.g. Gurgaon, Delhi, Noida, Mumbai"),
    property_type: Optional[PropertyType] = Query(None),
    listing_type: Optional[ListingType] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    bedrooms: Optional[int] = Query(None),
    q: Optional[str] = Query(None, description="Search query across title and description"),
    sort: Optional[str] = Query("newest", description="price_asc, price_desc, newest"),
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=100),
    db=Depends(get_db)
):
    filter_query = {"status": "active"}

    if city:
        filter_query["location.city"] = {"$regex": f"^{city}$", "$options": "i"}
    if property_type:
        filter_query["property_type"] = property_type.value
    if listing_type:
        filter_query["listing_type"] = listing_type.value
    if bedrooms:
        if bedrooms >= 4:
            filter_query["bedrooms"] = {"$gte": bedrooms}
        else:
            filter_query["bedrooms"] = bedrooms
            
    if min_price is not None or max_price is not None:
        filter_query["price"] = {}
        if min_price is not None:
            filter_query["price"]["$gte"] = min_price
        if max_price is not None:
            filter_query["price"]["$lte"] = max_price

    if q:
        filter_query["$or"] = [
            {"title": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
            {"location.address": {"$regex": q, "$options": "i"}}
        ]

    sort_criteria = [("created_at", -1)]
    if sort == "price_asc":
        sort_criteria = [("price", 1)]
    elif sort == "price_desc":
        sort_criteria = [("price", -1)]
    elif sort == "newest":
        sort_criteria = [("created_at", -1)]

    total = await db.properties.count_documents(filter_query)
    skip = (page - 1) * limit
    
    cursor = db.properties.find(filter_query).sort(sort_criteria).skip(skip).limit(limit)
    props = await cursor.to_list(length=limit)

    # Fetch agents in batch
    agent_ids = list(set([ObjectId(p["agent_id"]) for p in props if ObjectId.is_valid(p.get("agent_id"))]))
    agent_map = {}
    if agent_ids:
        agents_cursor = db.agents.find({"_id": {"$in": agent_ids}})
        agents_list = await agents_cursor.to_list(length=len(agent_ids))
        for ag in agents_list:
            agent_map[str(ag["_id"])] = ag

    items = [format_property(p, agent_map.get(str(p.get("agent_id")))) for p in props]
    total_pages = (total + limit - 1) // limit if limit > 0 else 1

    return PropertyListResponse(
        items=items,
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages
    )

@router.get("/featured", response_model=List[PropertyOut])
async def get_featured_properties(limit: int = Query(6, ge=1, le=20), db=Depends(get_db)):
    cursor = db.properties.find({"featured": True, "status": "active"}).sort("created_at", -1).limit(limit)
    props = await cursor.to_list(length=limit)
    
    if len(props) < limit:
        # Fallback to any active listings if not enough featured
        needed = limit - len(props)
        existing_ids = [p["_id"] for p in props]
        extra_cursor = db.properties.find({"_id": {"$nin": existing_ids}, "status": "active"}).sort("created_at", -1).limit(needed)
        extra_props = await extra_cursor.to_list(length=needed)
        props.extend(extra_props)

    agent_ids = list(set([ObjectId(p["agent_id"]) for p in props if ObjectId.is_valid(p.get("agent_id"))]))
    agent_map = {}
    if agent_ids:
        agents_cursor = db.agents.find({"_id": {"$in": agent_ids}})
        agents_list = await agents_cursor.to_list(length=len(agent_ids))
        for ag in agents_list:
            agent_map[str(ag["_id"])] = ag

    return [format_property(p, agent_map.get(str(p.get("agent_id")))) for p in props]

@router.get("/{id}", response_model=PropertyOut)
async def get_property_by_id(id: str, db=Depends(get_db)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid property ID format")
    
    prop = await db.properties.find_one({"_id": ObjectId(id)})
    if not prop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")
    
    agent_doc = None
    if ObjectId.is_valid(prop.get("agent_id")):
        agent_doc = await db.agents.find_one({"_id": ObjectId(prop["agent_id"])})
        
    return format_property(prop, agent_doc)

@router.post("", response_model=PropertyOut, dependencies=[Depends(verify_admin_key)])
async def create_property(prop_in: PropertyCreate, db=Depends(get_db)):
    now = datetime.utcnow()
    prop_doc = prop_in.model_dump()
    prop_doc["created_at"] = now
    prop_doc["updated_at"] = now
    
    result = await db.properties.insert_one(prop_doc)
    prop_doc["_id"] = result.inserted_id
    
    agent_doc = None
    if ObjectId.is_valid(prop_doc["agent_id"]):
        agent_doc = await db.agents.find_one({"_id": ObjectId(prop_doc["agent_id"])})
        
    return format_property(prop_doc, agent_doc)

@router.patch("/{id}", response_model=PropertyOut, dependencies=[Depends(verify_admin_key)])
async def update_property(id: str, prop_in: PropertyUpdate, db=Depends(get_db)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid property ID format")
        
    update_data = {k: v for k, v in prop_in.model_dump(exclude_unset=True).items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields provided for update")
        
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.properties.find_one_and_update(
        {"_id": ObjectId(id)},
        {"$set": update_data},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")
        
    agent_doc = None
    if ObjectId.is_valid(result.get("agent_id")):
        agent_doc = await db.agents.find_one({"_id": ObjectId(result["agent_id"])})
        
    return format_property(result, agent_doc)

@router.delete("/{id}", dependencies=[Depends(verify_admin_key)])
async def delete_property(id: str, db=Depends(get_db)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid property ID format")
    result = await db.properties.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")
    return {"message": "Property deleted successfully"}
