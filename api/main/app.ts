import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*", } });


io.on("connection", (socket) => {
    console.log("a user connected");
});

httpServer.listen(9000, () => {
    console.log("listening on *:9000");
});