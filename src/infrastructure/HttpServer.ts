// import express from "express";
// import http from "http";
// import chatRouter from "../interfaces/routes/ChatRoutes";

// export const createHttpServer = () => {
//     const app = express();
//     const server = http.createServer(app);

//     app.get("/", (req, res) => {
//         res.send("Chat service is running");
//     });

//     app.use('/chat', chatRouter);

//     return server;
// };
import express from "express";
import http from "http";
import chatRouter from "../interfaces/routes/ChatRoutes";
import cors from "cors";
import bodyParser from "body-parser";
import { Request, Response, NextFunction } from "express";

export const createHttpServer = () => {
    const app = express();
    const server = http.createServer(app);

    app.use(bodyParser.json());

    app.use(cors());

    app.get("/", (req, res) => {
        res.send("Chat service is running");
    });

    app.use('/chat', chatRouter);

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });

    return server;
};
