from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CABase(BaseModel):
    name: str
    email: str
    phone_number: str
    license_number: str

class CACreate(CABase):
    pass

class CA(CABase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
