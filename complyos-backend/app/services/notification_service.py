async def send_notification(user_id: str, title: str, message: str) -> dict:
    """Send notification to user"""
    # Implementation to save and send notification
    return {"id": "notif123", "status": "sent"}

async def get_notifications(user_id: str, limit: int = 10) -> list:
    """Get user notifications"""
    # Implementation to fetch from database
    return []
