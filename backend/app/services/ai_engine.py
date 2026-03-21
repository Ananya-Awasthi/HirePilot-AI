import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY"),
)

MODEL = "gemini-3-flash-preview"


# 🎯 START QUESTION
def generate_question(role, resume_text):
    prompt = f"""
    You are a friendly professional interviewer.

    Role: {role}

    Candidate Resume:
    {resume_text}

    Instructions:
    - Ask ONLY ONE question
    - Keep it simple and conversational
    - Match beginner level

    Ask the question.
    """

    response = client.models.generate_content(
        model=MODEL,
        contents=prompt
    )

    return response.text


# 🔁 FOLLOW-UP
def generate_followup(answer):
    prompt = f"""
    Candidate answered: {answer}

    Ask ONE short follow-up question.
    Keep it natural and simple.
    """

    response = client.models.generate_content(
        model=MODEL,
        contents=prompt
    )

    return response.text


# 🧠 INTERVIEW EVALUATION (NEW)
def evaluate_interview(qa_list):
    formatted = ""

    for qa in qa_list:
        formatted += f"Q: {qa['question']}\nA: {qa['answer']}\n\n"

    prompt = f"""
    You are an expert interview evaluator.

    Analyze this interview:

    {formatted}

    Return STRICT JSON:
    {{
        "score": number (0-100),
        "feedback": "overall feedback",
        "improvements": ["point1", "point2", "point3"]
    }}
    """

    response = client.models.generate_content(
        model=MODEL,
        contents=prompt
    )

    try:
        cleaned = response.text.strip().replace("```json", "").replace("```", "")
        return json.loads(cleaned)
    except:
        return {
            "score": 70,
            "feedback": response.text,
            "improvements": [
                "Be more confident",
                "Give structured answers",
                "Add real examples"
            ]
        }