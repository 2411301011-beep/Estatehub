from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.property import PropertyOut
from app.models.inquiry import InquiryOut
from app.routers.properties import format_property

router = APIRouter(prefix="/api/users/me", tags=["User Profile & Favorites"])

@router.get("/favorites", response_model=List[PropertyOut])
async def get_my_favorites(current_user=Depends(get_current_user), db=Depends(get_db)):
    saved_ids_raw = current_user.get("saved_properties", [])
    valid_object_ids = [ObjectId(pid) for pid in saved_ids_raw if ObjectId.is_valid(pid)]
    
    if not valid_object_ids:
        return []
        
    cursor = db.properties.find({"_id": {"$in": valid_object_ids}})
    props = await cursor.to_list(length=len(valid_object_ids))
    
    # Hydrate agents
    agent_ids = list(set([ObjectId(p["agent_id"]) for p in props if ObjectId.is_valid(p.get("agent_id"))]))
    agent_map = {}
    if agent_ids:
        agents_cursor = db.agents.find({"_id": {"$in": agent_ids}})
        agents_list = await agents_cursor.to_list(length=len(agent_ids))
        for ag in agents_list:
            agent_map[str(ag["_id"])] = ag
            
    return [format_property(p, agent_map.get(str(p.get("agent_id")))) for p in props]

@router.post("/favorites/{property_id}")
async def add_favorite(property_id: str, current_user=Depends(get_current_user), db=Depends(get_db)):
    if not ObjectId.is_valid(property_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid property ID format")
        
    prop = await db.properties.find_one({"_id": ObjectId(property_id)})
    if not prop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")
        
    user_id = current_user["_id"]
    await db.users.update_one(
        {"_id": user_id},
        {"$addToSet": {"saved_properties": property_id}}
    )
    return {"message": "Property saved to favorites", "property_id": property_id}

@router.delete("/favorites/{property_id}")
async def remove_favorite(property_id: str, current_user=Depends(get_current_user), db=Depends(get_db)):
    user_id = current_user["_id"]
    await db.users.update_one(
        {"_id": user_id},
        {"$pull": {"saved_properties": property_id}}
    )
    return {"message": "Property removed from favorites", "property_id": property_id}

@router.get("/inquiries", response_model=List[InquiryOut])
async def get_my_inquiries(current_user=Depends(get_current_user), db=Depends(get_db)):
    user_id_str = current_user["id"]
    cursor = db.inquiries.find({"user_id": user_id_str}).sort("created_at", -1)
    inquiries = await cursor.to_list(length=100)
    
    # Populate property titles
    prop_ids = [ObjectId(iq["property_id"]) for iq in inquiries if ObjectId.is_valid(iq.get("property_id"))]
    prop_map = {}
    if prop_ids:
        props_cursor = db.properties.find({"_id": {"$in": prop_ids}})
        props_list = await props_cursor.to_list(length=len(prop_ids))
        for p in props_list:
            prop_map[str(p["_id"])] = p["title"]
            
    res = []
    for iq in inquiries:
        res.append(InquiryOut(
            id=str(iq["_id"]),
            property_id=str(iq["property_id"]),
            property_title=prop_map.get(str(iq["property_id"]), "Unknown Property"),
            agent_id=str(iq.get("agent_id", "")),
            user_id=iq.get("user_id"),
            name=iq["name"],
            email=iq["email"],
            phone=iq["phone"],
            message=iq["message"],
            status=iq.get("status", "new"),
            created_at=iq["created_at"]
        ))
    return res
