from fastapi import FastAPI
from app.routes import resume, interview, confidence
from fastapi.middleware.cors import CORSMiddleware
from chatbot.chatbot_routes import router as chatbot_router
import threading
from app.services.vision import start_confidence_tracking



app = FastAPI()

# ✅ CORS (IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# 🔥 Start background confidence tracking
threading.Thread(target=start_confidence_tracking, daemon=True).start()

# ✅ ROUTES
app.include_router(resume.router)
app.include_router(interview.router)
app.include_router(confidence.router)
app.include_router(chatbot_router)

@app.get("/")
def home():
    return {"message": "AI Interview Backend Running 🚀"}