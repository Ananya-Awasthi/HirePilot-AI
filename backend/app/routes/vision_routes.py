from fastapi import APIRouter, UploadFile, File
import cv2
import numpy as np

router = APIRouter(prefix="/vision", tags=["Vision"])

face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
)

@router.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    image_bytes = await file.read()

    np_arr = np.frombuffer(image_bytes, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if frame is None:
        return {"warning": "Image error", "confidence": 0}

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=3,
        minSize=(50, 50)
    )

    if len(faces) == 0:
        return {"warning": "⚠️ No face detected", "confidence": 20}
    elif len(faces) > 1:
        return {"warning": "🚨 Multiple people detected", "confidence": 40}
    else:
        return {"warning": "✅ Good", "confidence": 85}
    

@router.post("/tab-switch")
def tab_switch():
      print("⚠️ User switched tab")
      return {"status": "logged"}