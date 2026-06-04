from pydantic import BaseModel
from datetime import datetime

class DocumentBase(BaseModel):
    business_id: str
    document_type: str
    file_name: str
    file_url: str

class DocumentCreate(DocumentBase):
    pass

class Document(DocumentBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
