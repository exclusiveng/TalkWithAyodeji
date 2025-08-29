import { useState, useEffect } from "react";
import "./compomentStyles/chatBox.css";
import { startConnection, sendMessage, setAuthToken } from "../middleware/signalrService";
import type { ChatMessage } from "../middleware/signalrService";
import { useAuth } from "../context/AuthContext";

const ChatBox = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { token, isAuthenticated } = useAuth();
  const user = "User";

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setMessages([
        {
          user: "Bot",
          message: "Please log in to start chatting."
        }
      ]);
      return;
    }

    // Set the auth token for the SignalR service
    setAuthToken(token);

    // Start SignalR connection
    startConnection((msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Add welcome message
    setMessages([
      {
        user: "Bot",
        message: "Hello! I'm TalkWithAyodeji ChatBot. How can I help you today?"
      }
    ]);
  }, [isAuthenticated, token]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !isAuthenticated || !token) return;

    const userMessage: ChatMessage = { user, message: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send message via SignalR/HTTP
      await sendMessage(user, input, (botResponse: ChatMessage) => {
        setMessages((prev) => [...prev, botResponse]);
      });

      // The response will come through the SignalR connection or HTTP fallback
      // We'll handle it in the message callback
      setIsLoading(false);

    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
      
      // Show error message
      const errorMessage: ChatMessage = {
        user: "Bot",
        message: "Sorry, I'm having trouble processing your message right now. Please try again."
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  // If not authenticated, show login message
  if (!isAuthenticated || !token) {
    return (
      <div className="chatbox-wrapper">
        <div className="chatbox-card">
          <header className="chatbox-header">
            <h3>TalkWithAyodeji ChatBot</h3>
          </header>
          <main className="chatbox-messages">
            <div className="chat-message bot">
              <strong>Bot: </strong>Please log in to start chatting.
            </div>
          </main>
        </div>
      </div>
    );
  }

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
              className={`chat-message ${msg.user === user ? "user" : "bot"}`}
            >
              <strong>{msg.user}: </strong>{msg.message}
            </div>
          ))}
          {isLoading && (
            <div className="chat-message bot">
              <strong>Bot: </strong>
              <span className="typing-indicator">Typing...</span>
            </div>
          )}
        </main>

        <footer className="chatbox-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading}>
            {isLoading ? "Sending..." : "Send"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ChatBox;
