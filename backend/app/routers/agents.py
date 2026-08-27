from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from bson import ObjectId
from app.core.database import get_db
from app.models.agent import AgentOut
from app.models.property import PropertyOut
from app.routers.properties import format_property, format_agent

router = APIRouter(prefix="/api/agents", tags=["Agents"])

@router.get("", response_model=List[AgentOut])
async def get_agents(q: Optional[str] = Query(None), db=Depends(get_db)):
    filter_query = {}
    if q:
        filter_query["$or"] = [
            {"name": {"$regex": q, "$options": "i"}},
            {"agency": {"$regex": q, "$options": "i"}}
        ]
    cursor = db.agents.find(filter_query).sort("name", 1)
    agents = await cursor.to_list(length=100)
    
    # Compute active listing counts
    result = []
    for ag in agents:
        agent_id_str = str(ag["_id"])
        listings_cnt = await db.properties.count_documents({"agent_id": agent_id_str, "status": "active"})
        ag["listings_count"] = listings_cnt
        result.append(format_agent(ag))
    return result

@router.get("/{id}", response_model=AgentOut)
async def get_agent_by_id(id: str, db=Depends(get_db)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid agent ID format")
    
    agent = await db.agents.find_one({"_id": ObjectId(id)})
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")
        
    listings_cnt = await db.properties.count_documents({"agent_id": id, "status": "active"})
    agent["listings_count"] = listings_cnt
    return format_agent(agent)

@router.get("/{id}/properties", response_model=List[PropertyOut])
async def get_agent_properties(id: str, db=Depends(get_db)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid agent ID format")
        
    agent = await db.agents.find_one({"_id": ObjectId(id)})
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")
        
    cursor = db.properties.find({"agent_id": id, "status": "active"}).sort("created_at", -1)
    props = await cursor.to_list(length=50)
    
    return [format_property(p, agent) for p in props]
