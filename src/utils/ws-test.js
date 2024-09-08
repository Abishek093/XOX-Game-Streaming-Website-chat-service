const WebSocket = require("ws");

const ws = new WebSocket("ws://localhost:5001");

ws.on("open", () => {
  console.log("Connected to WebSocket server");
  ws.send("Hello from client");
});

ws.on("message", (message) => {
  console.log(`Received: ${message}`);
});

ws.on("error", (error) => {
  console.error(`Error: ${error}`);
});

ws.on("close", () => {
  console.log("Connection closed");
});
