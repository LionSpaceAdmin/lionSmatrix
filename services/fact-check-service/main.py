import os
import uuid
import logging
from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Literal

# --- Configuration & Client Initialization ---

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Pydantic Models (Request/Response Schemas) ---

class FactCheckRequest(BaseModel):
    text_to_check: str
    source_url: str | None = None

class FactCheckSubmissionResponse(BaseModel):
    job_id: str
    status: Literal["pending", "in_progress"]

class Claim(BaseModel):
    claim: str
    is_true: bool | None = None
    confidence: float | None = None
    explanation: str

class JobStatusResponse(BaseModel):
    job_id: str
    status: Literal["pending", "in_progress", "completed", "failed"]
    results: List[Claim] | None = None
    error_message: str | None = None

class HealthResponse(BaseModel):
    ok: bool

# --- FastAPI Application ---

app = FastAPI(
    title="Fact-Check Service",
    description="A service to submit text for fact-checking and retrieve the results.",
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

@app.post("/v1/factcheck/submit", response_model=FactCheckSubmissionResponse, tags=["Fact-Check"])
async def submit_fact_check(request: FactCheckRequest):
    """
    Stub for submitting a text for fact-checking.
    **This endpoint is not implemented.**
    """
    logger.warning("submit_fact_check endpoint is a stub and not implemented.")
    # In a real app, this would create a job and return its ID.
    new_job_id = str(uuid.uuid4())
    return {"job_id": new_job_id, "status": "pending"}

@app.get("/v1/factcheck/{jobId}", response_model=JobStatusResponse, tags=["Fact-Check"])
async def get_fact_check_status(jobId: str):
    """
    Stub for retrieving the status and results of a fact-checking job.
    **This endpoint is not implemented.**
    """
    logger.warning("get_fact_check_status endpoint is a stub and not implemented.")
    # This would check the job status in a database.
    # Returning a mock "completed" response for contract validation.
    mock_claims = [
        Claim(
            claim="The sky is blue.",
            is_true=True,
            confidence=0.98,
            explanation="Based on Rayleigh scattering of sunlight in the Earth's atmosphere."
        )
    ]
    return {
        "job_id": jobId,
        "status": "completed",
        "results": mock_claims
    }
