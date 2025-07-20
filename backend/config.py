from decouple import config

class Settings:
    GOOGLE_CLIENT_ID = config("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = config("GOOGLE_CLIENT_SECRET")
    JWT_SECRET_KEY = config("JWT_SECRET_KEY", default="your-secret-key-change-this")
    JWT_ALGORITHM = "HS256"
    JWT_EXPIRATION_TIME = 3600  # 1 hour
    MONGODB_URL = config("MONGODB_URL", default="mongodb://localhost:27017")
    DATABASE_NAME = config("DATABASE_NAME", default="fastapi_auth")
    BACKEND_BASE_URL = config("BACKEND_BASE_URL", default="http://localhost:8000")
    FRONTEND_BASE_URL = config("FRONTEND_BASE_URL", default="http://localhost:5173")
    ELEVEN_LABS_KEY = config("ELEVEN_LABS_KEY")
    
settings = Settings()






