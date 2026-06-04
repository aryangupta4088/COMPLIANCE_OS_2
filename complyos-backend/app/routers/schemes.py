from fastapi import APIRouter, HTTPException
from app.agents import scout

router = APIRouter(prefix="/schemes", tags=["schemes"])

@router.get("/")
async def list_schemes(skip: int = 0, limit: int = 10):
    """List all available schemes"""
    try:
        # API implementation will be added
        return []
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/match")
async def match_schemes(business_data: dict):
    """Match business to relevant schemes using SCOUT"""
    try:
        schemes = await scout.scout_schemes(business_data)
        return {"matching_schemes": schemes}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{scheme_id}")
async def get_scheme_details(scheme_id: str):
    """Get details for a specific scheme"""
    try:
        # API implementation will be added
        return {}
    except Exception as e:
        raise HTTPException(status_code=404, detail="Scheme not found")
