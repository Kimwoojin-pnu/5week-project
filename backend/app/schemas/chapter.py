from pydantic import BaseModel
from typing import List, Optional


class CodeExample(BaseModel):
    language: str
    code: str
    caption: Optional[str] = None


class ChapterListItem(BaseModel):
    id: int
    title: str
    description: str
    is_free: bool
    order: int


class ChapterDetailResponse(ChapterListItem):
    content: str
    code_examples: List[CodeExample] = []
