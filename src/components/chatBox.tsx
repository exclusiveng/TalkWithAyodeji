// Type guards for message rendering
function hasStringMessage(obj: unknown): obj is { message: string; } {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "message" in obj &&
    typeof (obj as { message: unknown }).message === "string"
  );
}
function hasErrors(obj: unknown): obj is { errors: unknown; } {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "errors" in obj
  );
}
import { useState, useEffect, useRef } from "react";
import "./compomentStyles/chatBox.css";
import { startConnection, sendMessage } from "../middleware/signalrService";
import { Bot, User, Send, CircleDot } from "lucide-react";


type ChatMessage = {
  user: string;
  message: string | { [key: string]: unknown };
};


const ChatBox = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const user = "User";

  useEffect(() => {
    // Start SignalR connection
    startConnection((msg: ChatMessage) => {
      setIsLoading(false); // Stop loading when a message is received
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

  useEffect(() => {
    // Scroll to the bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);


  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { user, message: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send message via SignalR only
      // The bot's response will be handled by the SignalR connection listener
      await sendMessage(input);
      // We don't set isLoading to false here, we wait for the bot's response
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
          <div className="header-info">
            <Bot className="header-icon" />
            <h3>Ayodeji's AI</h3>
          </div>
          <div className="status">
            <CircleDot className="status-icon" />
            <span>Online</span>
          </div>
        </header>

        <main className="chatbox-messages">
          {messages.map((msg, index) => {
            const isCurrentUser = msg.user === user;
            let displayMessage: string;
            if (typeof msg.message === "string") { // Standard bot or user message
              displayMessage = msg.message;
            } else if (
              msg.message &&
              typeof msg.message === "object" &&
              "data" in msg.message &&
              typeof (msg.message as { data?: unknown }).data !== "undefined"
            ) {
              // Handle complex object with a 'data' property
              const data = (msg.message as { data?: unknown }).data;
              displayMessage = typeof data === "string"
                ? data
                : JSON.stringify(data);
            } else if (
              msg.message &&
              typeof msg.message === "object" &&
              hasStringMessage(msg.message)
            ) {
              // Handle complex object with a 'message' property
              displayMessage = msg.message.message;
            } else if (
              msg.message &&
              typeof msg.message === "object" &&
              hasErrors(msg.message)
            ) {
              // Handle error object
              displayMessage = "Sorry, something went wrong. Please try again later.";
            } else {
              // Fallback for any other object format
              displayMessage = "[Unrecognized message format]";
            }
            return (
              <div
                key={index}
                className={`message-wrapper ${isCurrentUser ? "user" : "bot"}`}
              >
                <div className="avatar">
                  {isCurrentUser ? <User /> : <Bot />}
                </div>
                <div className="message-content">{displayMessage}</div>
              </div>
            );
          })}
          {isLoading && (
            <div className="message-wrapper bot">
              <div className="avatar">
                <Bot />
              </div>
              <div className="message-content typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        <footer className="chatbox-input">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={e => e.key === "Enter" && handleSend()}
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading || !input.trim()} aria-label="Send message">
            <Send />
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ChatBox;
