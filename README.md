**🚀 HirePilot AI – Smart Interview Preparation Platform**

HirePilot AI is an intelligent interview preparation platform that simulates real interview experiences using AI. 
It analyzes resumes, generates role-based questions, captures user responses, and provides insights through a live dashboard.
---

**📌 Features**

-🎯 AI-generated interview questions based on role & resume

-🎤 Voice input + speech-to-text processing

-📸 Live camera capture for monitoring (every 15 sec)

-🧠 Follow-up question generation

-📊 Dashboard with captured snapshots & session analysis

-💬 Interactive chatbot support

-⚡ Real-time frontend + backend integration

---

**🏗️ Tech Stack**

**Frontend**

React.js
Face API.js (for face detection)
CSS (custom styling)

**Backend**

FastAPI
Python
AI Engine (custom logic / OpenAI integration if used)
Speech-to-text processing

---

**⚙️ Installation & Setup**

1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/HirePilot-AI.git
cd HirePilot-AI
```

2️⃣ Backend Setup
```bash
cd backend

# create virtual environment
python -m venv venv

# activate
venv\Scripts\activate   # Windows
source venv/bin/activate  # Mac/Linux

# install dependencies
pip install -r requirements.txt

# run server
uvicorn app.main:app --reload
```

3️⃣ Frontend Setup
```bash
cd frontend

npm install
npm start
```

---

**🧠 How It Works**

-User uploads resume & selects role

-AI generates first interview question

-User answers via voice/text

-Backend processes response

-AI generates follow-up questions

-Camera captures images every 15 seconds

-Dashboard displays session insights

---

**🚧 Future Improvements**

-Emotion detection

-AI scoring system

-Detailed feedback reports

-Multi-role interview simulation

-Cloud deployment
