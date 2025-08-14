import { useState } from "react";
import "./compomentStyles/chatBox.css";

const ChatBox = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Thanks for your message! I’ll get back to you." }
      ]);
    }, 800);
  };

  return (
    <div className="chatbox-wrapper">
      <div className="chatbox-card">
        <header className="chatbox-header">
          <h3>TalkWithAyodeji ChatBot</h3>
        </header>

        <main className="chatbox-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}
            >
              {msg.text}
            </div>
          ))}
        </main>

        <footer className="chatbox-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </footer>
      </div>
    </div>
  );
};

export default ChatBox;
