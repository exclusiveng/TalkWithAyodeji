import * as signalR from "@microsoft/signalr";

// Message type for clarity
export interface ChatMessage {
  user: string;
  message: string;
}

let connection: signalR.HubConnection | null = null;
let useHttpFallback = false;

/**
 * Starts a SignalR connection and sets up message listener
 * @param onMessageReceived callback fired when a new message arrives
 */
export const startConnection = async (
  onMessageReceived: (msg: ChatMessage) => void
): Promise<void> => {
  try {
    connection = new signalR.HubConnectionBuilder()
      .withUrl("https://talkwithayodeji.onrender.com/chat")
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveMessage", (user: string, message: string) => {
      onMessageReceived({ user, message });
    });

    await connection.start();
    console.log("SignalR Connected.");
    useHttpFallback = false;
  } catch (err) {
    console.error("SignalR connection failed: ", err);
    useHttpFallback = false;
  }
};

/**
 * Sends a message to the SignalR hub
 * @param user sender's username
 * @param message text message
 */
export const sendMessage = async (
  // user: string,
  question: string
): Promise<void> => {
  if (connection && !useHttpFallback) {
    try {
      await connection.invoke("AskAIQuestion", question);
      return;
    } catch (err) {
      console.error("SignalR send failed:", err);
    }
  } else {
    console.error("SignalR connection is not available. Message not sent.");
  }
};
