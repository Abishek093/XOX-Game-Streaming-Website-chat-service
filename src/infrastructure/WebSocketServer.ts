import WebSocket from "ws";

export const createWebSocketServer = (server: any): WebSocket.Server => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws: WebSocket) => {
    ws.on("message", (message: string) => {
      console.log(`Received message => ${message}`);
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });                             
    ws.send("Welcome to the chat service!");
  });

  return wss;
};