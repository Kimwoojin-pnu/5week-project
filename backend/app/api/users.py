from fastapi import APIRouter, Depends
from ..core.security import get_current_user
from ..models.user import User
from ..schemas.user import UserResponse

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    return current_user
