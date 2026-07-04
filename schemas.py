from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ResearchRequest(BaseModel):
    topic: str

class ResearchResponse(BaseModel):
    id: int
    topic: str
    status: str
    search_result: Optional[str] = None
    scraped_result: Optional[str] = None
    report: Optional[str] = None
    feedback: Optional[str] = None
    critic_score: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
