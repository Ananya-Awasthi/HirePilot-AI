from fastapi import APIRouter, Form, Body
from app.services.ai_engine import (
    generate_question,
    generate_followup,
    evaluate_interview
)

router = APIRouter(prefix="/interview", tags=["Interview"])


# 🎯 START
@router.post("/start")
def start_interview(role: str = Form(...), resume_text: str = Form(...)):
    question = generate_question(role, resume_text)
    return {"question": question}


# 🎤 ANSWER
@router.post("/answer")
def process_answer(answer: str = Form(...)):
    next_question = generate_followup(answer)

    return {
        "transcribed_text": answer,
        "next_question": next_question
    }


# 🧠 END INTERVIEW (NEW)
@router.post("/end")
def end_interview(data: dict = Body(...)):
    qa_list = data.get("qa_list", [])

    result = evaluate_interview(qa_list)

    return result
