from pydantic import BaseModel
from datetime import datetime

class SchemeBase(BaseModel):
    name: str
    description: str
    ministry: str
    eligibility_criteria: str

class SchemeCreate(SchemeBase):
    pass

class Scheme(SchemeBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
