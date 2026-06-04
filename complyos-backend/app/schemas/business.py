from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BusinessBase(BaseModel):
    name: str
    registration_number: str
    business_type: str
    industry: str

class BusinessCreate(BusinessBase):
    pass

class Business(BusinessBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
