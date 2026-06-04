from datetime import datetime
from typing import Optional

class Scheme:
    def __init__(
        self,
        name: str,
        description: str,
        ministry: str,
        eligibility_criteria: str,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
        id: Optional[str] = None,
    ):
        self.id = id
        self.name = name
        self.description = description
        self.ministry = ministry
        self.eligibility_criteria = eligibility_criteria
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()

    def to_dict(self):
        return {
            "_id": self.id,
            "name": self.name,
            "description": self.description,
            "ministry": self.ministry,
            "eligibility_criteria": self.eligibility_criteria,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
