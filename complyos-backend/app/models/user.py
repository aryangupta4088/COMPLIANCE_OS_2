from datetime import datetime
from typing import Optional

class User:
    def __init__(
        self,
        email: str,
        full_name: str,
        hashed_password: str,
        phone_number: Optional[str] = None,
        is_active: bool = True,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
        id: Optional[str] = None,
    ):
        self.id = id
        self.email = email
        self.full_name = full_name
        self.hashed_password = hashed_password
        self.phone_number = phone_number
        self.is_active = is_active
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()

    def to_dict(self):
        return {
            "_id": self.id,
            "email": self.email,
            "full_name": self.full_name,
            "hashed_password": self.hashed_password,
            "phone_number": self.phone_number,
            "is_active": self.is_active,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
