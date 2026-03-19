import React, { useState, useEffect, useRef } from "react";

export default function ChatButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [dots, setDots] = useState("");
  const [history, setHistory] = useState([]);

  const chatEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Typing dots animation
  useEffect(() => {
    if (!typing) return;

    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? "" : prev + "."));
    }, 400);

    return () => clearInterval(interval);
  }, [typing]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);

    const updatedHistory = [...history, input];
    setHistory(updatedHistory);

    setTyping(true);

    try {
      const response = await fetch("http://127.0.0.1:8001/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: input,
          history: updatedHistory
        })
      });

      const data = await response.json();

      setTimeout(() => {
        const botMessage = { sender: "bot", text: data.reply };
        setMessages(prev => [...prev, botMessage]);
        setTyping(false);
      }, 800);

    } catch (err) {
      setTyping(false);
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Error connecting to server." }
      ]);
    }

    setInput("");
  };

  return (
    <>
      {/* Floating Button */}
      <div className="chat-fab">
        <button
          className="chat-btn"
          title="Chat with AI"
          onClick={() => setOpen(prev => !prev)}
        >
          💬
        </button>
      </div>

      {/* Chat Window */}
      {open && (
        <div style={styles.container}>

          <div style={styles.header}>
            AI Interview Coach
            <button
              onClick={() => setOpen(false)}
              style={styles.closeBtn}
            >
              ❌
            </button>
          </div>

          <div style={styles.chatBox}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={
                  msg.sender === "user"
                    ? styles.userMessage
                    : styles.botMessage
                }
              >
                {msg.text}
              </div>
            ))}

            {typing && (
              <div style={styles.botMessage}>
                Typing{dots}
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          <div style={styles.inputArea}>
            <input
              style={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button style={styles.button} onClick={sendMessage}>
              Send
            </button>
          </div>

        </div>
      )}
    </>
  );
}

const styles = {
  container: {
    position: "fixed",
    bottom: "90px",
    right: "20px",
    width: "350px",
    height: "500px",
    borderRadius: "12px",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
    zIndex: 9999
  },

  header: {
    background: "#007bff",
    color: "#fff",
    padding: "10px",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
    fontWeight: "bold"
  },

  closeBtn: {
    float: "right",
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer"
  },

  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: "10px"
  },

  userMessage: {
    alignSelf: "flex-end",
    background: "#007bff",
    color: "#fff",
    padding: "8px",
    borderRadius: "10px",
    margin: "5px"
  },

  botMessage: {
    alignSelf: "flex-start",
    background: "#e5e5ea",
    padding: "8px",
    borderRadius: "10px",
    margin: "5px"
  },

  inputArea: {
    display: "flex",
    padding: "10px",
    gap: "8px",
    background: "#f5f7fb",
    borderTop: "1px solid #ddd"
  },

  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "25px",
    border: "1px solid #ccc",
    outline: "none"
  },

  button: {
    padding: "10px 18px",
    borderRadius: "25px",
    border: "none",
    background: "linear-gradient(135deg, #007bff, #00c6ff)",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer"
  }
};