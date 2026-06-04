from datetime import datetime
from typing import Optional

class Document:
    def __init__(
        self,
        business_id: str,
        document_type: str,
        file_name: str,
        file_url: str,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
        id: Optional[str] = None,
    ):
        self.id = id
        self.business_id = business_id
        self.document_type = document_type
        self.file_name = file_name
        self.file_url = file_url
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()

    def to_dict(self):
        return {
            "_id": self.id,
            "business_id": self.business_id,
            "document_type": self.document_type,
            "file_name": self.file_name,
            "file_url": self.file_url,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
