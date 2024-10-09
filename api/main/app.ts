import "dotenv/config";
import "./websocket";
import "./node-cron/CleanDeadChats";
import { httpServer } from "./http";

const PORT = process.env.PORT;

httpServer.listen(PORT, () => console.log("Ready!"));