// Type guards for message rendering
function hasStringMessage(obj: unknown): obj is { message: string } {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "message" in obj &&
    typeof (obj as { message: unknown }).message === "string"
  );
}
function hasErrors(obj: unknown): obj is { errors: unknown } {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "errors" in obj
  );
}
import { useState, useEffect } from "react";
import "./compomentStyles/chatBox.css";
import { startConnection, sendMessage } from "../middleware/signalrService";


type ChatMessage = {
  user: string;
  message: string | { [key: string]: unknown };
};


const ChatBox = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  
  const user = "User";

  useEffect(() => {
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
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { user, message: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send message via SignalR only
      await sendMessage(input);
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



  return (
    <div className="chatbox-wrapper">
      <div className="chatbox-card">
        <header className="chatbox-header">
          <h3>TalkWithAyodeji ChatBot</h3>
        </header>

        <main className="chatbox-messages">
          {messages.map((msg, index) => {
            const isCurrentUser = msg.user === user;
            const displayName = isCurrentUser ? "You" : (msg.user === "Bot" ? "Bot" : "User");
            let displayMessage: string;
            if (typeof msg.message === "string") {
              displayMessage = msg.message;
            } else if (
              msg.message &&
              typeof msg.message === "object" &&
              "data" in msg.message &&
              typeof (msg.message as { data?: unknown }).data !== "undefined"
            ) {
              // Prefer showing 'data' if present
              const data = (msg.message as { data?: unknown }).data;
              displayMessage = typeof data === "string"
                ? data
                : JSON.stringify(data);
            } else if (
              msg.message &&
              typeof msg.message === "object" &&
              hasStringMessage(msg.message)
            ) {
              displayMessage = msg.message.message;
            } else if (
              msg.message &&
              typeof msg.message === "object" &&
              hasErrors(msg.message)
            ) {
              displayMessage = "Sorry, something went wrong. Please try again later.";
            } else {
              displayMessage = "[Unrecognized message format]";
            }
            return (
              <div
                key={index}
                className={`chat-message ${isCurrentUser ? "user" : "bot"}`}
              >
                <strong>{displayName}: </strong>
                {displayMessage}
              </div>
            );
          })}
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
