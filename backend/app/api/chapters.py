from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from ..core.security import get_optional_user
from ..models.user import User
from ..data.chapters import get_chapter_list, get_chapter_by_id
from ..schemas.chapter import ChapterListItem, ChapterDetailResponse

router = APIRouter()


@router.get("", response_model=List[ChapterListItem])
async def list_chapters():
    return get_chapter_list()


@router.get("/{chapter_id}", response_model=ChapterDetailResponse)
async def get_chapter(
    chapter_id: int,
    current_user: User = Depends(get_optional_user)
):
    chapter = get_chapter_by_id(chapter_id)
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")

    if not chapter["is_free"]:
        if not current_user or current_user.plan != "pro":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="PRO_REQUIRED"
            )

    return chapter
