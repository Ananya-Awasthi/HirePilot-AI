import cv2
import numpy as np

confidence_score_global = 50

# Face + Eye
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
)

eye_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_eye.xml'
)

# 🔥 LOAD YOLO
# net = cv2.dnn.readNet("app/models/yolov3-tiny.weights", "app/models/yolov3-tiny.cfg")

# with open("app/models/coco.names", "r") as f:
#     classes = [line.strip() for line in f.readlines()]

# layer_names = net.getLayerNames()
# output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers()]


# def detect_phone(frame):
#     h, w, _ = frame.shape

#     blob = cv2.dnn.blobFromImage(frame, 1/255.0, (416, 416), swapRB=True, crop=False)
#     net.setInput(blob)
#     outputs = net.forward(output_layers)

#     for output in outputs:
#         for detection in output:
#             scores = detection[5:]
#             class_id = np.argmax(scores)
#             confidence = scores[class_id]

#             # 📱 class 67 = "cell phone"
#             if class_id == 67 and confidence > 0.5:
#                 return True

#     return False


# def start_confidence_tracking():
#     global confidence_score_global

#     cap = cv2.VideoCapture(0)
#     confidence_score = 50

#     while True:
#         ret, frame = cap.read()
#         if not ret:
#             break

#         gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#         faces = face_cascade.detectMultiScale(gray, 1.3, 5)

#         warning_text = ""

#         # FACE LOGIC
#         if len(faces) == 0:
#             confidence_score -= 2
#             warning_text = "⚠️ Look at screen!"

#         elif len(faces) == 1:
#             confidence_score += 1

#         elif len(faces) > 1:
#             confidence_score -= 5
#             warning_text = "🚨 Multiple people!"

#         for (x, y, w, h) in faces:
#             color = (255, 0, 0)
#             if len(faces) > 1:
#                 color = (0, 0, 255)

#             cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)

#             roi_gray = gray[y:y+h, x:x+w]
#             roi_color = frame[y:y+h, x:x+w]

#             eyes = eye_cascade.detectMultiScale(roi_gray)

#             if len(eyes) >= 2:
#                 confidence_score += 2
#             else:
#                 confidence_score -= 1
#                 if len(faces) == 1:
#                     warning_text = "⚠️ Maintain eye contact!"

#             for (ex, ey, ew, eh) in eyes:
#                 cv2.rectangle(roi_color, (ex, ey), (ex+ew, ey+eh), (0, 255, 0), 2)

#         # 🔥 PHONE DETECTION (REAL)
#         # if detect_phone(frame):
#         #     warning_text = "📱 Phone detected!"
#         #     confidence_score -= 5

#         confidence_score = max(0, min(100, confidence_score))
#         confidence_score_global = confidence_score

#         cv2.putText(frame, f'Confidence: {confidence_score}', (20, 40),
#                     cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)

#         if warning_text:
#             cv2.putText(frame, warning_text, (20, 80),
#                         cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

#         cv2.imshow("AI Proctoring", frame)

#         if cv2.waitKey(1) & 0xFF == ord('q'):
#             break

#     cap.release()
#     cv2.destroyAllWindows()


def get_confidence_score():
    return confidence_score_global