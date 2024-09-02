import WebSocket from "ws";

export const createWebSocketServer = (server: any): WebSocket.Server => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws: WebSocket) => {
    console.log("New client connected");

    ws.on("message", (message: string) => {
      console.log(`Received message => ${message}`);
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    ws.send("Welcome to the chat service!");
  });

  return wss;
};
