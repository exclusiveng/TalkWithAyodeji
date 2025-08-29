import * as signalR from "@microsoft/signalr";

// Message type for clarity
export interface ChatMessage {
  user: string;
  message: string;
}

let connection: signalR.HubConnection | null = null;
let useHttpFallback = false;
let authToken: string | null = null;

/**
 * Sets the authentication token for the chat service
 * @param token JWT token for authentication
 */
export const setAuthToken = (token: string | null): void => {
  authToken = token;
  
  // If we have a token and SignalR is connected, update the connection
  if (token && connection) {
    connection.stop();
    connection = null;
    useHttpFallback = false;
  }
};

/**
 * Starts a SignalR connection and sets up message listener
 * @param onMessageReceived callback fired when a new message arrives
 */
export const startConnection = async (
  onMessageReceived: (msg: ChatMessage) => void
): Promise<void> => {
  if (!authToken) {
    console.error("No authentication token available");
    useHttpFallback = true;
    return;
  }

  try {
    connection = new signalR.HubConnectionBuilder()
      .withUrl("https://talkwithayodeji.onrender.com/api/Admin/ask-ai", {
        accessTokenFactory: () => authToken || ""
      })
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveMessage", (user: string, message: string) => {
      onMessageReceived({ user, message });
    });

    await connection.start();
    console.log("SignalR Connected.");
    useHttpFallback = false;
  } catch (err) {
    console.error("SignalR connection failed, falling back to HTTP: ", err);
    useHttpFallback = true;
  }
};

/**
 * Sends a message to the SignalR hub or falls back to HTTP
 * @param user sender's username
 * @param message text message
 * @param onResponse callback for handling the response (optional)
 */
export const sendMessage = async (
  user: string, 
  message: string, 
  onResponse?: (msg: ChatMessage) => void
): Promise<void> => {
  if (!authToken) {
    console.error("No authentication token available");
    return;
  }

  if (connection && !useHttpFallback) {
    try {
      await connection.invoke("SendMessage", user, message);
    } catch (err) {
      console.error("SignalR send failed, falling back to HTTP: ", err);
      useHttpFallback = true;
      // Fall through to HTTP fallback
    }
  }
  
  // HTTP fallback if SignalR is not available
  if (useHttpFallback || !connection) {
    try {
      const response = await fetch(`https://talkwithayodeji.onrender.com/api/Admin/ask-ai?question=${encodeURIComponent(message)}`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Message sent via HTTP:", result);
        
        // If we have a callback, trigger it with the bot response
        if (onResponse && result.success && result.data) {
          const botMessage: ChatMessage = {
            user: "Bot",
            message: result.data
          };
          onResponse(botMessage);
        }
      } else {
        console.error("HTTP send failed:", response.status);
      }
    } catch (err) {
      console.error("HTTP fallback also failed:", err);
    }
  }
};
