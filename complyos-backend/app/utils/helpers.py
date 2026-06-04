def format_date(date) -> str:
    """Format date for display"""
    return str(date)

def calculate_days_until_deadline(deadline) -> int:
    """Calculate days until deadline"""
    from datetime import datetime
    today = datetime.now()
    delta = deadline - today
    return delta.days if delta.days >= 0 else 0

def generate_id() -> str:
    """Generate unique ID"""
    import uuid
    return str(uuid.uuid4())
