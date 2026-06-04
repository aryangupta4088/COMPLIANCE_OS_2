from datetime import datetime
from typing import Optional

class Compliance:
    def __init__(
        self,
        business_id: str,
        compliance_type: str,
        deadline: datetime,
        status: str = "pending",
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
        id: Optional[str] = None,
    ):
        self.id = id
        self.business_id = business_id
        self.compliance_type = compliance_type
        self.deadline = deadline
        self.status = status
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()

    def to_dict(self):
        return {
            "_id": self.id,
            "business_id": self.business_id,
            "compliance_type": self.compliance_type,
            "deadline": self.deadline,
            "status": self.status,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
