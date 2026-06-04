from datetime import datetime
from typing import Optional

class CA:
    def __init__(
        self,
        name: str,
        email: str,
        phone_number: str,
        license_number: str,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
        id: Optional[str] = None,
    ):
        self.id = id
        self.name = name
        self.email = email
        self.phone_number = phone_number
        self.license_number = license_number
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()

    def to_dict(self):
        return {
            "_id": self.id,
            "name": self.name,
            "email": self.email,
            "phone_number": self.phone_number,
            "license_number": self.license_number,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
