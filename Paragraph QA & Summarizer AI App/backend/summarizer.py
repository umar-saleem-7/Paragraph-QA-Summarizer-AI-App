from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from transformers import pipeline

router = APIRouter()

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

class TextRequest(BaseModel):
    text: str

@router.post("/summarize")
def summarize_text(data: TextRequest):
    if len(data.text.strip()) < 20:
        raise HTTPException(status_code=400, detail="Text too short to summarize.")
    summary = summarizer(data.text, max_length=100, min_length=30, do_sample=False)
    return {"summary": summary[0]['summary_text']}
