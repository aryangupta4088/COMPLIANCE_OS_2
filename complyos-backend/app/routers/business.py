from fastapi import APIRouter, HTTPException
from app.schemas.business import Business, BusinessCreate

router = APIRouter(prefix="/business", tags=["business"])

@router.post("/", response_model=Business)
async def create_business(business_data: BusinessCreate):
    """Create a new business"""
    try:
        # API implementation will be added
        return {
            "id": "123",
            "name": business_data.name,
            "registration_number": business_data.registration_number,
            "business_type": business_data.business_type,
            "industry": business_data.industry,
            "user_id": "user123",
            "created_at": None,
            "updated_at": None,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/")
async def list_businesses():
    """List all businesses for current user"""
    try:
        # API implementation will be added
        return []
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{business_id}", response_model=Business)
async def get_business(business_id: str):
    """Get business details"""
    try:
        # API implementation will be added
        return None
    except Exception as e:
        raise HTTPException(status_code=404, detail="Business not found")
