import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    google_client_id: str = os.getenv("GOOGLE_CLIENT_ID", "")
    google_client_secret: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
    google_redirect_uri: str = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/api/auth/callback")

    jwt_secret_key: str = os.getenv("JWT_SECRET_KEY", "dev-secret-key-change-in-production")
    jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    jwt_expire_hours: int = int(os.getenv("JWT_EXPIRE_HOURS", "24"))

    polar_access_token: str = os.getenv("POLAR_ACCESS_TOKEN", "")
    polar_product_id: str = os.getenv("POLAR_PRODUCT_ID", "")
    polar_webhook_secret: str = os.getenv("POLAR_WEBHOOK_SECRET", "")

    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./app.db")
    frontend_url: str = os.getenv("FRONTEND_URL", "http://localhost:5173")


settings = Settings()
