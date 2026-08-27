from fastapi import APIRouter, Depends
from app.core.database import get_db

router = APIRouter(prefix="/api/meta", tags=["Metadata"])

@router.get("/cities")
async def get_cities(db=Depends(get_db)):
    pipeline = [
        {"$match": {"status": "active"}},
        {"$group": {"_id": "$location.city", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    results = await db.properties.aggregate(pipeline).to_list(length=20)
    
    city_counts = []
    for item in results:
        if item["_id"]:
            city_counts.append({"name": item["_id"], "count": item["count"]})
            
    # Guarantee standard cities are returned even if count is 0
    standard_cities = ["Gurgaon", "Delhi", "Noida", "Mumbai"]
    existing_names = set([c["name"] for c in city_counts])
    for sc in standard_cities:
        if sc not in existing_names:
            city_counts.append({"name": sc, "count": 0})
            
    return city_counts

@router.get("/property-types")
async def get_property_types(db=Depends(get_db)):
    pipeline = [
        {"$match": {"status": "active"}},
        {"$group": {"_id": "$property_type", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    results = await db.properties.aggregate(pipeline).to_list(length=10)
    
    types = []
    for item in results:
        if item["_id"]:
            types.append({"type": item["_id"], "count": item["count"]})
            
    standard_types = ["apartment", "villa", "commercial"]
    existing_types = set([t["type"] for t in types])
    for st in standard_types:
        if st not in existing_types:
            types.append({"type": st, "count": 0})
            
    return types
