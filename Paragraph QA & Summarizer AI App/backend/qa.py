from fastapi import APIRouter, UploadFile, Form
from pydantic import BaseModel
from transformers import pipeline
from sentence_transformers import SentenceTransformer
from nltk.tokenize import sent_tokenize
import numpy as np

router = APIRouter()

# ========== Config ==========
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"
QA_MODEL_NAME = "distilbert-base-uncased-distilled-squad"

embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)
qa_pipeline = pipeline("question-answering", model=QA_MODEL_NAME)

# ========== In-Memory Stores ==========
user_documents = {}       # {username: [chunks]}
user_embeddings = {}      # {username: [embedding_vectors]}
user_context_memory = {}  # {username: (question, answer, chunk)}

# ========== Helper Functions ==========

def chunk_text(text, max_tokens=200):
    sentences = sent_tokenize(text)
    chunks, chunk, count = [], [], 0
    for sentence in sentences:
        length = len(sentence.split())
        if count + length > max_tokens:
            if chunk:
                chunks.append(" ".join(chunk))
            chunk = [sentence]
            count = length
        else:
            chunk.append(sentence)
            count += length
    if chunk:
        chunks.append(" ".join(chunk))
    return chunks

def get_embeddings(chunks):
    return embedding_model.encode(chunks)

def find_best_chunk(question, chunks, embeddings):
    q_embedding = embedding_model.encode([question])[0]
    scores = np.dot(embeddings, q_embedding)
    best_idx = np.argmax(scores)
    return chunks[best_idx]

def get_answer(question, chunk):
    result = qa_pipeline(question=question, context=chunk)
    return result['answer']

# ========== API Models ==========

class QuestionInput(BaseModel):
    username: str
    question: str

# ========== Routes ==========

@router.post("/upload-passage")
async def upload_passage(username: str = Form(...), file: UploadFile = None, text: str = Form(None)):
    content = ""
    if file:
        content = (await file.read()).decode('utf-8')
    elif text:
        content = text
    else:
        return {"success": False, "message": "No file or text provided"}

    chunks = chunk_text(content)
    embeddings = get_embeddings(chunks)

    user_documents[username] = chunks
    user_embeddings[username] = embeddings

    return {"success": True, "chunks": len(chunks)}

@router.post("/ask-question")
def ask_question(data: QuestionInput):
    username = data.username
    question = data.question

    if username not in user_documents:
        return {"success": False, "message": "No passage uploaded"}

    chunks = user_documents[username]
    embeddings = user_embeddings[username]

    best_chunk = find_best_chunk(question, chunks, embeddings)
    answer = get_answer(question, best_chunk)

    # Save memory
    user_context_memory[username] = (question, answer, best_chunk)

    return {
        "success": True,
        "answer": answer,
        "context": best_chunk
    }

@router.get("/get-history/{username}")
def get_chat_history(username: str):
    if username in user_context_memory:
        question, answer, context = user_context_memory[username]
        return {
            "last_question": question,
            "last_answer": answer,
            "last_context": context
        }
    return {"message": "No history found"}
