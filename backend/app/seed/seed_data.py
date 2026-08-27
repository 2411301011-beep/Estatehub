import asyncio
from datetime import datetime, timedelta
import random
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

MONGO_URI = "mongodb://localhost:27017"
DATABASE_NAME = "estatehub"

SAMPLE_AGENTS = [
    {
        "name": "Vikram Sharma",
        "photo_url": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
        "agency": "Luxe Estates India",
        "phone": "+91 98100 12345",
        "email": "vikram@luxeestates.in",
        "bio": "Specializing in ultra-luxury penthouses and golf course residences across Gurgaon and Delhi NCR with over 12 years of experience.",
        "verified": True,
        "rating": 4.9,
        "listings_count": 8
    },
    {
        "name": "Priya Patel",
        "photo_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
        "agency": "Prestige Realty",
        "phone": "+91 98210 56789",
        "email": "priya@prestigerealty.in",
        "bio": "Premier agent for luxury villas, heritage properties, and upscale apartments in South Delhi and Noida Expressway.",
        "verified": True,
        "rating": 4.8,
        "listings_count": 6
    },
    {
        "name": "Rajeev Menon",
        "photo_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
        "agency": "Skyline Commercial & Living",
        "phone": "+91 98765 43210",
        "email": "rajeev@skylineproperties.in",
        "bio": "Commercial real estate expert and premium residential advisor for Sea Face properties in Mumbai & Bandra Kurla Complex.",
        "verified": True,
        "rating": 4.9,
        "listings_count": 7
    },
    {
        "name": "Ananya Roy",
        "photo_url": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
        "agency": "Apex Prime Properties",
        "phone": "+91 98111 22334",
        "email": "ananya@apexprime.in",
        "bio": "Advising high-net-worth clients on prime residential acquisitions in Golf Course Extension Road, Gurgaon.",
        "verified": True,
        "rating": 4.7,
        "listings_count": 5
    },
    {
        "name": "Karan Malhotra",
        "photo_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
        "agency": "Metropolitan Realty",
        "phone": "+91 99580 99887",
        "email": "karan@metropolitan.in",
        "bio": "Specialist in modern gated communities and luxury high-rises in Noida Sector 150 & Central Delhi.",
        "verified": True,
        "rating": 4.8,
        "listings_count": 6
    },
    {
        "name": "Siddharth Verma",
        "photo_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
        "agency": "Luxe Estates India",
        "phone": "+91 98990 77665",
        "email": "siddharth@luxeestates.in",
        "bio": "Expert in commercial spaces, retail hubs, and corporate towers in Cyber City and Worli Mumbai.",
        "verified": True,
        "rating": 4.9,
        "listings_count": 5
    }
]

PROPERTY_IMAGES = [
    [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ],
    [
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"
    ],
    [
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80"
    ],
    [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80"
    ]
]

SPECIFIC_PROPERTIES = [
    {
        "title": "3 BHK Luxury Apartment in Gurgaon",
        "description": "Exquisite 3 BHK apartment in DLF Phase 5, Gurgaon. Features private elevator lobby, Italian marble flooring, floor-to-ceiling windows with panoramic golf course views, integrated smart home automation, and Italian modular kitchen.",
        "property_type": "apartment",
        "listing_type": "buy",
        "price": 32500000, # ₹3.25 Cr
        "price_unit": "total",
        "location": {"city": "Gurgaon", "address": "DLF Phase 5, Golf Course Road, Gurgaon", "lat": 28.4595, "lng": 77.0266},
        "bedrooms": 3,
        "bathrooms": 3,
        "area_sqft": 2850,
        "amenities": ["Infinity Pool", "Golf Course View", "Private Elevator", "Smart Automation", "24/7 Security", "Clubhouse", "Gymnasium", "2 Covered Parkings"],
        "featured": True,
        "verified": True
    },
    {
        "title": "4 BHK Modern Villa",
        "description": "Contemporary 4 BHK triplex villa in Sector 65, Gurgaon. Designed by renowned international architects, offering a private lap pool, lush landscaped garden, double-height ceiling living hall, and private terrace lounge.",
        "property_type": "villa",
        "listing_type": "buy",
        "price": 78000000, # ₹7.8 Cr
        "price_unit": "total",
        "location": {"city": "Gurgaon", "address": "Golf Course Extension Road, Sector 65, Gurgaon", "lat": 28.4089, "lng": 77.0684},
        "bedrooms": 4,
        "bathrooms": 5,
        "area_sqft": 5200,
        "amenities": ["Private Lap Pool", "Landscaped Garden", "Private Terrace", "Home Theater", "VRV Air Conditioning", "Servant Quarter", "Gated Security"],
        "featured": True,
        "verified": True
    },
    {
        "title": "Skyline Penthouse",
        "description": "Opulent duplex penthouse atop Worli, Mumbai. Offers breathtaking 270-degree views of the Arabian Sea and the Bandra-Worli Sea Link. Comes with private plunge pool and bespoke designer finishes.",
        "property_type": "apartment",
        "listing_type": "buy",
        "price": 145000000, # ₹14.5 Cr
        "price_unit": "total",
        "location": {"city": "Mumbai", "address": "Worli Sea Face, Mumbai", "lat": 19.0176, "lng": 72.8173},
        "bedrooms": 4,
        "bathrooms": 5,
        "area_sqft": 4600,
        "amenities": ["Sea View", "Private Plunge Pool", "Duplex Layout", "Concierge Service", "4 Car Parkings", "Spa & Wellness Center"],
        "featured": True,
        "verified": True
    },
    {
        "title": "The Heritage Villa",
        "description": "Graceful 5 BHK colonial-inspired villa in Vasant Vihar, South Delhi. Features sprawling private lawns, grand entrance foyer, servant quarters, and solar power backup.",
        "property_type": "villa",
        "listing_type": "buy",
        "price": 125000000, # ₹12.5 Cr
        "price_unit": "total",
        "location": {"city": "Delhi", "address": "Vasant Vihar, South Delhi", "lat": 28.5589, "lng": 77.1628},
        "bedrooms": 5,
        "bathrooms": 6,
        "area_sqft": 6500,
        "amenities": ["Lush Private Lawn", "Solar Power", "Grand Entrance", "Servant Quarters", "High Perimeter Security", "Basement Parking"],
        "featured": True,
        "verified": True
    },
    {
        "title": "Luxury 3 BHK in Gurgaon",
        "description": "High-floor luxury residence in M3M Golfestate, Gurgaon. Impeccably furnished with premium imported fittings, wooden flooring in master suite, and expansive balconies overlooking central greens.",
        "property_type": "apartment",
        "listing_type": "rent",
        "price": 120000, # ₹1.2 Lakh/mo
        "price_unit": "per_month",
        "location": {"city": "Gurgaon", "address": "Sector 65, Golf Course Extension, Gurgaon", "lat": 28.4112, "lng": 77.0699},
        "bedrooms": 3,
        "bathrooms": 3,
        "area_sqft": 2400,
        "amenities": ["Fully Furnished", "Central Greens View", "All-Inclusive Club", "Squash Court", "Power Backup", "24/7 Security"],
        "featured": True,
        "verified": True
    },
    {
        "title": "Corporate Office Space in Cyber City",
        "description": "Grade A commercial office tower floor in Cyber City, Gurgaon. Grade-A LEED Gold certified building with high-speed elevators, centralized HVAC, and 100% power backup.",
        "property_type": "commercial",
        "listing_type": "rent",
        "price": 450000, # ₹4.5 Lakh/mo
        "price_unit": "per_month",
        "location": {"city": "Gurgaon", "address": "DLF Cyber City, Phase 2, Gurgaon", "lat": 28.4950, "lng": 77.0890},
        "bedrooms": 0,
        "bathrooms": 4,
        "area_sqft": 3500,
        "amenities": ["LEED Gold Certified", "Centralized HVAC", "High-Speed Elevators", "100% Power Backup", "Dedicated Parking", "Cafeteria Zone"],
        "featured": False,
        "verified": True
    }
]

CITY_TEMPLATES = {
    "Gurgaon": [
        ("Grand 4 BHK Residence in Golf Course Road", "apartment", "buy", 45000000, 4, 4, 3400),
        ("Modern 3 BHK Flat in Nirvana Country", "apartment", "buy", 22000000, 3, 3, 2100),
        ("Luxury Gated Villa in Sohna Road", "villa", "buy", 48000000, 4, 5, 4100),
        ("High-End Retail Storefront in MG Road", "commercial", "buy", 35000000, 0, 2, 1200),
        ("Premium 2 BHK Service Apartment", "apartment", "rent", 65000, 2, 2, 1350),
        ("5 BHK Independent Builder Floor", "apartment", "buy", 55000000, 5, 5, 4200),
        ("Executive Villa with Swimming Pool", "villa", "rent", 250000, 4, 5, 4800)
    ],
    "Delhi": [
        ("Ultra-Luxury 4 BHK Floor in Panchsheel Park", "apartment", "buy", 95000000, 4, 5, 4500),
        ("Stately 5 BHK Bungalow in Jor Bagh", "villa", "buy", 210000000, 5, 6, 8000),
        ("3 BHK Modern Apartment in Greater Kailash", "apartment", "buy", 42000000, 3, 3, 2600),
        ("Prime Office Suite in Connaught Place", "commercial", "rent", 300000, 0, 3, 2200),
        ("Charming 3 BHK in Hauz Khas Enclave", "apartment", "rent", 110000, 3, 3, 2200),
        ("Luxury Duplex in Sundar Nagar", "apartment", "buy", 115000000, 4, 4, 5000),
        ("Independent Commercial Building in Okhla", "commercial", "buy", 85000000, 0, 6, 9500)
    ],
    "Noida": [
        ("Skyline 3 BHK Apartment in Sector 150", "apartment", "buy", 16500000, 3, 3, 1950),
        ("4 BHK Luxury Villa in Jaypee Greens", "villa", "buy", 52000000, 4, 5, 4300),
        ("Modern 2 BHK Condo near Noida Expressway", "apartment", "buy", 9800000, 2, 2, 1250),
        ("IT Park Office Space in Sector 62", "commercial", "rent", 180000, 0, 2, 2500),
        ("Furnished 3 BHK in Sector 128", "apartment", "rent", 55000, 3, 3, 1800),
        ("Golf View 4 BHK Penthouse Sector 128", "apartment", "buy", 38000000, 4, 4, 3800),
        ("Commercial Retail Shop in Sector 18", "commercial", "buy", 27000000, 0, 1, 900)
    ],
    "Mumbai": [
        ("Sea-Facing 3 BHK in Bandra West", "apartment", "buy", 88000000, 3, 3, 2100),
        ("Luxurious 4 BHK Apartment in Lower Parel", "apartment", "buy", 92000000, 4, 4, 3100),
        ("Spacious Commercial Space in BKC", "commercial", "rent", 600000, 0, 4, 4000),
        ("Modern 2 BHK Sea View Flat in Juhu", "apartment", "rent", 175000, 2, 2, 1150),
        ("Ultra-Exclusive Villa in Pali Hill", "villa", "buy", 250000000, 5, 6, 7200),
        ("High-Floor 3 BHK in Powai Greens", "apartment", "buy", 34000000, 3, 3, 1750),
        ("Boutique Office Space in Nariman Point", "commercial", "buy", 45000000, 0, 2, 1400)
    ]
}

ALL_AMENITIES = [
    "Swimming Pool", "Gymnasium", "24/7 Security", "Power Backup", "Clubhouse",
    "Car Parking", "Balcony View", "Smart Home Automation", "Private Elevator",
    "Landscaped Garden", "Kids Play Area", "Squash Court", "Tennis Court",
    "EV Charging Station", "Servant Quarter", "Concierge Service"
]

async def seed_database():
    print("Connecting to MongoDB for seeding...")
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DATABASE_NAME]

    # Clear existing collections
    print("Clearing existing collections...")
    await db.agents.delete_many({})
    await db.properties.delete_many({})
    await db.users.delete_many({})
    await db.inquiries.delete_many({})

    # Insert Agents
    print("Inserting sample agents...")
    agent_objs = []
    now = datetime.utcnow()
    for ag in SAMPLE_AGENTS:
        ag_doc = ag.copy()
        ag_doc["created_at"] = now - timedelta(days=random.randint(30, 300))
        agent_objs.append(ag_doc)
        
    result_agents = await db.agents.insert_many(agent_objs)
    agent_ids = [str(_id) for _id in result_agents.inserted_ids]
    print(f"Inserted {len(agent_ids)} agents.")

    # Insert Properties
    print("Inserting sample properties...")
    properties_to_insert = []

    # 1. Add specific properties required by prompt
    for idx, sp in enumerate(SPECIFIC_PROPERTIES):
        agent_id = agent_ids[idx % len(agent_ids)]
        img_set = PROPERTY_IMAGES[idx % len(PROPERTY_IMAGES)]
        p_doc = sp.copy()
        p_doc["images"] = img_set
        p_doc["agent_id"] = agent_id
        p_doc["status"] = "active"
        p_doc["created_at"] = now - timedelta(days=idx * 2)
        p_doc["updated_at"] = now - timedelta(days=idx * 2)
        properties_to_insert.append(p_doc)

    # 2. Add templated properties per city to reach 35+ total properties
    prop_counter = len(properties_to_insert)
    for city, templates in CITY_TEMPLATES.items():
        for title, ptype, ltype, price, beds, baths, sqft in templates:
            agent_id = random.choice(agent_ids)
            img_set = random.choice(PROPERTY_IMAGES)
            price_unit = "per_month" if ltype == "rent" else "total"
            amenities = random.sample(ALL_AMENITIES, random.randint(4, 8))
            featured = random.choice([True, False, False, False])
            
            p_doc = {
                "title": title,
                "description": f"Beautiful {beds} bed, {baths} bath {ptype} located in prime area of {city}. Designed for luxurious living with top-of-the-line fixtures, natural light, and premium community amenities.",
                "property_type": ptype,
                "listing_type": ltype,
                "price": price,
                "price_unit": price_unit,
                "location": {
                    "city": city,
                    "address": f"Prime Sector, {city}",
                    "lat": 28.45 + random.uniform(-0.1, 0.1),
                    "lng": 77.02 + random.uniform(-0.1, 0.1)
                },
                "bedrooms": beds,
                "bathrooms": baths,
                "area_sqft": sqft,
                "amenities": amenities,
                "images": img_set,
                "agent_id": agent_id,
                "verified": True,
                "featured": featured,
                "status": "active",
                "created_at": now - timedelta(days=random.randint(1, 90)),
                "updated_at": now - timedelta(days=random.randint(0, 30))
            }
            properties_to_insert.append(p_doc)
            prop_counter += 1

    await db.properties.insert_many(properties_to_insert)
    print(f"Inserted {len(properties_to_insert)} properties across Gurgaon, Delhi, Noida, and Mumbai!")

    # Update agent listing counts
    for ag_id in agent_ids:
        cnt = await db.properties.count_documents({"agent_id": ag_id, "status": "active"})
        await db.agents.update_one({"_id": ObjectId(ag_id)}, {"$set": {"listings_count": cnt}})

    print("Database seeding completed successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
