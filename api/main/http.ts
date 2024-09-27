import "express-async-errors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { errorHandler } from "./middlewares/ErrorHandler";
import router from "./routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", router);
app.use(errorHandler);

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*", } });

export { io, httpServer };