# Dummy data
from fastapi import APIRouter
router=APIRouter()
leaderboard_data = [
    {"name": "Priya", "score": 92},
    {"name": "Rahul", "score": 85},
    {"name": "Aman", "score": 78},
    {"name": "Sneha", "score": 88},
    {"name": "Karan", "score": 80},
    {"name": "Anjali", "score": 45},
]

@router.get("/leaderboard")
def get_leaderboard():
    # Sort by score (highest first)
    sorted_data = sorted(leaderboard_data, key=lambda x: x["score"], reverse=True)
    
    # Add rank
    for i, user in enumerate(sorted_data):
        user["rank"] = i + 1
    
    return sorted_data