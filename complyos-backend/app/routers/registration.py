from fastapi import APIRouter, HTTPException
from app.agents import pathway

router = APIRouter(prefix="/registration", tags=["registration"])

@router.post("/pathway")
async def generate_registration_pathway(business_data: dict):
    """Generate registration pathway for business"""
    try:
        result = await pathway.pathway_registration(business_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/roadmap")
async def generate_roadmap(business_type: str):
    """Generate compliance roadmap"""
    try:
        result = await pathway.generate_compliance_roadmap(business_type)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
