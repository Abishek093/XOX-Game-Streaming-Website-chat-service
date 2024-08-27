import express from "express";
import http from "http";

export const createHttpServer = () => {
    const app = express();
    const server = http.createServer(app);

    app.get("/", (req, res) => {
        res.send("Chat service is running");
    });

    return server;
};
