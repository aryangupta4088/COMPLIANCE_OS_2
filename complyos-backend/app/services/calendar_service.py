from datetime import datetime

async def get_compliance_calendar(business_id: str) -> list:
    """Fetch compliance calendar items"""
    # Implementation to fetch from database
    return []

async def add_deadline(business_id: str, deadline_data: dict) -> dict:
    """Add compliance deadline"""
    # Implementation to save to database
    return {"id": "deadline123", "status": "created"}
