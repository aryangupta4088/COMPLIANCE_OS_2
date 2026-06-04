from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ComplianceBase(BaseModel):
    business_id: str
    compliance_type: str
    deadline: datetime
    status: str = "pending"

class ComplianceCreate(ComplianceBase):
    pass

class Compliance(ComplianceBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
