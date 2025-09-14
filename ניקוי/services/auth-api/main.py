import os
import uuid
import logging
from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import List

# --- Configuration ---

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# This would be used to protect the /me endpoint
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# --- Pydantic Models ---

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class RefreshRequest(BaseModel):
    refresh_token: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    roles: List[str]

class HealthResponse(BaseModel):
    ok: bool

# --- FastAPI Application ---

app = FastAPI(
    title="Auth API",
    description="Service for handling user authentication, token generation, and user info.",
    version="1.0.0"
)

# --- Middleware ---

@app.middleware("http")
async def add_request_id_and_log(request: Request, call_next):
    request_id = str(uuid.uuid4())
    logger.info(f"Request ID: {request_id} | Path: {request.url.path} | Method: {request.method}")

    response = await call_next(request)

    response.headers["X-Request-ID"] = request_id
    logger.info(f"Request ID: {request_id} | Response Status: {response.status_code}")
    return response

# --- API Endpoints ---

@app.get("/healthz", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Performs a health check of the service."""
    return {"ok": True}

@app.post("/login", response_model=TokenResponse, tags=["Authentication"])
async def login(request: LoginRequest):
    """
    Stub for user login.
    **This endpoint is not implemented.**
    """
    logger.warning("login endpoint is a stub and not implemented.")
    # In a real app, this would validate credentials and issue tokens
    return TokenResponse(access_token="fake_access_token", refresh_token="fake_refresh_token")


@app.post("/refresh", response_model=TokenResponse, tags=["Authentication"])
async def refresh_token(request: RefreshRequest):
    """
    Stub for refreshing an access token.
    **This endpoint is not implemented.**
    """
    logger.warning("refresh_token endpoint is a stub and not implemented.")
    # In a real app, this would validate the refresh token
    return TokenResponse(access_token="new_fake_access_token", refresh_token=request.refresh_token)


@app.get("/me", response_model=UserResponse, tags=["User"])
async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Stub for getting the current user's information.
    **This endpoint is not implemented.**
    """
    logger.warning("get_current_user endpoint is a stub and not implemented.")
    # In a real app, this would decode the JWT and fetch user data
    return UserResponse(id="user-123", username="testuser", email="test@example.com", roles=["user"])
