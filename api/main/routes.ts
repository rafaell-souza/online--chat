import express from "express";
const router = express.Router({ strict: true, caseSensitive: true });

import CreateNewUser from "./user/CreateNewUser";
import LoginUser from "./user/LoginUser";
import GetUserData from "./user/GetUserData";
import TokenCheckings from "./middlewares/TokenCheckings";
import { standardRateLimit, strictRateLimit } from "./middlewares/RateLimiting";
import CreateChat from "./chat/CreateChat";
import { GetChats } from "./chat/GetChats";
import { SearchChat } from "./chat/SearchChat";

router.post("/register", strictRateLimit, CreateNewUser.execute);
router.post("/login", strictRateLimit, LoginUser.execute)
router.get("/user", TokenCheckings, standardRateLimit, GetUserData.execute);

router.post("/chat", TokenCheckings, strictRateLimit, CreateChat.execute);
router.get("/chat/:id", TokenCheckings, standardRateLimit, GetChats.execute);
router.get("/chat/search/:userid", TokenCheckings, standardRateLimit, SearchChat.execute);

export default router;