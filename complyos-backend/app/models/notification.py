from datetime import datetime
from typing import Optional

class Notification:
    def __init__(
        self,
        user_id: str,
        title: str,
        message: str,
        notification_type: str,
        is_read: bool = False,
        created_at: Optional[datetime] = None,
        id: Optional[str] = None,
    ):
        self.id = id
        self.user_id = user_id
        self.title = title
        self.message = message
        self.notification_type = notification_type
        self.is_read = is_read
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self):
        return {
            "_id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "message": self.message,
            "notification_type": self.notification_type,
            "is_read": self.is_read,
            "created_at": self.created_at,
        }
