from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/stats")
async def get_admin_stats():
    """Get admin dashboard statistics"""
    try:
        # API implementation will be added
        return {
            "total_users": 0,
            "total_businesses": 0,
            "active_complaints": 0,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/users")
async def list_all_users(skip: int = 0, limit: int = 10):
    """List all users (admin only)"""
    try:
        # API implementation will be added
        return []
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
