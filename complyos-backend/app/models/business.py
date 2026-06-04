from datetime import datetime
from typing import Optional

class Business:
    def __init__(
        self,
        name: str,
        registration_number: str,
        business_type: str,
        industry: str,
        user_id: str,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
        id: Optional[str] = None,
    ):
        self.id = id
        self.name = name
        self.registration_number = registration_number
        self.business_type = business_type
        self.industry = industry
        self.user_id = user_id
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()

    def to_dict(self):
        return {
            "_id": self.id,
            "name": self.name,
            "registration_number": self.registration_number,
            "business_type": self.business_type,
            "industry": self.industry,
            "user_id": self.user_id,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
