import os
import uuid
import logging
from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Any

# --- Configuration & Client Initialization ---

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

PROJECT_ID = os.getenv("GOOGLE_PROJECT_ID")
LOCATION = os.getenv("VERTEX_LOCATION")

if PROJECT_ID and LOCATION:
    logger.info(f"Vertex AI configured for project '{PROJECT_ID}' in location '{LOCATION}'")
else:
    logger.warning("GOOGLE_PROJECT_ID and/or VERTEX_LOCATION environment variables not set.")

# --- Pydantic Models (Request/Response Schemas) ---

class RagSearchRequest(BaseModel):
    query: str
    top_k: int = 5
    filters: Dict[str, Any] = Field(default_factory=dict)

class RagSearchResult(BaseModel):
    document_id: str
    content_chunk: str
    score: float

class RagSearchResponse(BaseModel):
    request_id: str
    results: List[RagSearchResult]

class GroundedAnswerRequest(BaseModel):
    query: str
    search_results: List[RagSearchResult]

class GroundedAnswerResponse(BaseModel):
    request_id: str
    answer: str
    evidence: List[str] # List of document_ids used as evidence

class HealthResponse(BaseModel):
    ok: bool

# --- FastAPI Application ---

app = FastAPI(
    title="RAG Service",
    description="A service for Retrieval-Augmented Generation tasks.",
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

@app.post("/v1/rag/search", response_model=RagSearchResponse, tags=["RAG"])
async def search_rag(request: RagSearchRequest):
    """
    Stub for searching documents in a RAG system.
    **This endpoint is not implemented.**
    """
    logger.warning("search_rag endpoint is a stub and not implemented.")
    raise HTTPException(status_code=501, detail="Not Implemented")

@app.post("/v1/rag/grounded-answer", response_model=GroundedAnswerResponse, tags=["RAG"])
async def get_grounded_answer(request: GroundedAnswerRequest):
    """
    Stub for generating a grounded answer based on search results.
    **This endpoint is not implemented.**
    """
    logger.warning("get_grounded_answer endpoint is a stub and not implemented.")
    raise HTTPException(status_code=501, detail="Not Implemented")
