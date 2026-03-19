import json
import os
import random
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Get project root directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Path to database
db_path = os.path.join(BASE_DIR, "database", "chatbot_data.json")

# Load database
with open(db_path, "r") as f:
    data = json.load(f)

# Extract questions and answers form this
questions = [item["question"] for item in data]
answers = [item["answer"] for item in data]

# Better vectorizer (removes common words like "is", "the")
vectorizer = TfidfVectorizer(stop_words='english')
question_vectors = vectorizer.fit_transform(questions)

# Human-like prefixes
prefixes = [
    "That's a great question!",
    "Good question!",
    "Here's a helpful tip:",
    "Let me explain that:",
    "Here's what you can do:"
]

# Fallback responses
fallback_responses = [
    "I'm not sure I understood that. You can ask me about interview preparation, HR questions, confidence tips, or resume help.",
    "Hmm, I didn’t quite get that. Try asking about interview tips, resume building, or communication skills.",
    "I may not have the exact answer, but I can help with interview preparation and career guidance!"
]
def detect_topic(message):

    message = message.lower()

    if "confidence" in message:
        return "confidence"

    elif "resume" in message:
        return "resume"

    elif "hr" in message or "interview" in message:
        return "hr"

    elif "communication" in message:
        return "communication"

    elif "problem" in message or "coding" in message:
        return "technical"

    else:
        return "general"
    
def get_personalized_advice(topic):

    if topic == "confidence":
        return "💡 To improve confidence:\n• Practice mock interviews\n• Speak slowly and clearly\n• Maintain eye contact\n• Record yourself and improve"

    elif topic == "resume":
        return "📄 Resume Tips:\n• Keep it short (1 page)\n• Highlight achievements\n• Use bullet points\n• Add measurable results"

    elif topic == "hr":
        return "🎯 HR Interview Tips:\n• Prepare common questions\n• Be honest and confident\n• Use real-life examples\n• Stay calm"

    elif topic == "communication":
        return "🗣 Communication Tips:\n• Practice speaking daily\n• Improve vocabulary\n• Listen actively\n• Be clear and structured"

    elif topic == "technical":
        return "💻 Technical Tips:\n• Practice coding daily\n• Focus on fundamentals\n• Solve real problems\n• Learn debugging"

    else:
        return "✨ I can help you with interview preparation, resume building, and confidence improvement."    

def get_chatbot_response(user_message, history):

    # Detect topic
    topic = detect_topic(user_message)

    # Get base response
    context = " ".join(history[-2:]) if history else ""
    full_input = context + " " + user_message

    user_vector = vectorizer.transform([full_input])
    similarity = cosine_similarity(user_vector, question_vectors)

    score = similarity.max()
    index = similarity.argmax()

    # If unknown → fallback
    if score < 0.3:
        return get_personalized_advice(topic)

    # If known → combine answer + advice
    base_answer = random.choice(prefixes) + " " + answers[index]
    advice = get_personalized_advice(topic)

    return base_answer + "\n\n" + advice