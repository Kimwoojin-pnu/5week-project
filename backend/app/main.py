from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .core.database import engine, Base
from .api import auth, chapters, users, webhook, payment

Base.metadata.create_all(bind=engine)

app = FastAPI(title="DL Week 5 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(chapters.router, prefix="/api/chapters", tags=["chapters"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(webhook.router, prefix="/api/webhook", tags=["webhook"])
app.include_router(payment.router, prefix="/api/payment", tags=["payment"])


@app.get("/api/health")
async def health():
    return {"status": "ok"}
