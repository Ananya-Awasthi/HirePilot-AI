from fastapi import APIRouter
from app.services.vision import get_confidence_score

router = APIRouter(prefix="/confidence", tags=["Confidence"])

@router.get("/score")
def get_score():
    score = get_confidence_score()
    return {
        "confidence_score": score
    }