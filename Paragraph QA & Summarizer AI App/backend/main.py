from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from auth import router as auth_router  # use router, not individual functions
from chunker import chunk_text
from embedder import get_embeddings
from retriever import find_best_chunk
from answerer import answer_question
from memory import ContextualMemory
from db import initialize  # ✅ updated import from db.py
import summarizer

# Initialize FastAPI app
app = FastAPI()
app.include_router(summarizer.router)
# ✅ Initialize the database when FastAPI starts
@app.on_event("startup")

def startup_event():
    initialize()

# Register authentication routes
app.include_router(auth_router)

# Enable CORS for frontend (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize memory for chat context (per session)
memory = ContextualMemory()

# Request schemas
class QARequest(BaseModel):
    passage: str
    question: str

# === QA Endpoint ===
@app.post("/qa")
def qa_pipeline(request: QARequest):
    # Step 1: Chunk the passage
    chunks = chunk_text(request.passage)

    # Step 2: Generate embeddings for each chunk
    embeddings = get_embeddings(chunks)

    # Step 3: Retrieve most relevant chunk
    best_chunk = find_best_chunk(request.question, chunks, embeddings)

    # Step 4: Get answer from best chunk
    answer = answer_question(request.question, best_chunk)

    # Step 5: Update memory (history of interaction)
    memory.add_turn(request.question, answer, best_chunk)

    return {
        "answer": answer,
        "context": best_chunk,
        "history": memory.get_history()
    }
