from fastapi import APIRouter, Depends, HTTPException
from ..core.config import settings
from ..core.security import get_current_user
from ..models.user import User

router = APIRouter()


@router.post("/checkout")
async def create_checkout(current_user: User = Depends(get_current_user)):
    if not settings.polar_access_token or not settings.polar_product_id:
        raise HTTPException(status_code=503, detail="Payment not configured")

    import httpx
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.polar.sh/v1/checkouts/",
            headers={
                "Authorization": f"Bearer {settings.polar_access_token}",
                "Content-Type": "application/json",
            },
            json={
                "product_id": settings.polar_product_id,
                "customer_email": current_user.email,
            }
        )
        if response.status_code not in (200, 201):
            raise HTTPException(status_code=502, detail="Failed to create checkout")

        data = response.json()
        return {"checkout_url": data.get("url")}
