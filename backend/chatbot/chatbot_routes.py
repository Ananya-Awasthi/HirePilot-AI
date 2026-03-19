from fastapi import APIRouter
from pydantic import BaseModel
from chatbot.chatbot_service import get_chatbot_response

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    history: list = []

@router.post("/chat")

def chat(request: ChatRequest):

    reply = get_chatbot_response(request.message,request.history)

    return {"reply": reply}