from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/loans", tags=["loans"])

@router.get("/")
async def get_available_loans(business_id: str):
    """Get available loans for business"""
    try:
        # API implementation will be added
        return []
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/calculate-emi")
async def calculate_emi(principal: float, rate: float, tenure: int):
    """Calculate EMI for a loan"""
    try:
        monthly_rate = rate / 100 / 12
        emi = (principal * monthly_rate * (1 + monthly_rate) ** tenure) / ((1 + monthly_rate) ** tenure - 1)
        return {"emi": round(emi, 2), "total_amount": round(emi * tenure, 2)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
