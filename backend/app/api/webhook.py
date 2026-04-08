import hashlib
import hmac
from fastapi import APIRouter, Request, HTTPException, Depends
from sqlalchemy.orm import Session
from ..core.config import settings
from ..core.database import get_db
from ..models.user import User
from ..models.subscription import Subscription

router = APIRouter()


@router.post("/polar")
async def polar_webhook(request: Request, db: Session = Depends(get_db)):
    body = await request.body()
    signature = request.headers.get("polar-signature", "")

    if settings.polar_webhook_secret:
        expected = hmac.new(
            settings.polar_webhook_secret.encode(),
            body,
            hashlib.sha256
        ).hexdigest()
        if not hmac.compare_digest(f"sha256={expected}", signature):
            raise HTTPException(status_code=400, detail="Invalid signature")

    payload = await request.json()
    event_type = payload.get("type")

    if event_type == "order.created":
        data = payload.get("data", {})
        email = data.get("customer_email")
        status_val = data.get("status")

        if status_val == "paid" and email:
            user = db.query(User).filter(User.email == email).first()
            if user:
                user.plan = "pro"

                subscription = Subscription(
                    user_id=user.id,
                    polar_order_id=data.get("id", ""),
                    status="active",
                    amount=data.get("amount", 0),
                )
                db.add(subscription)
                db.commit()

    return {"ok": True}
