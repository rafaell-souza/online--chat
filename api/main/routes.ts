import express from "express";
const router = express.Router({ strict: true, caseSensitive: true });

import CreateNewUser from "./user/CreateNewUser";
import LoginUser from "./user/LoginUser";
import GetUserData from "./user/GetUserData";
import HttpAuthenticationMiddlewware from "./middlewares/HttpAuthenticationMiddlewware";
import { standardRateLimit, strictRateLimit } from "./middlewares/RateLimiting";
import CreateChat from "./chat/CreateChat";
import { GetChats } from "./chat/GetChats";
import { SearchChat } from "./chat/SearchChat";
import LogOut from "./user/LogOut";

router.post("/register", strictRateLimit, CreateNewUser.execute);
router.post("/login", strictRateLimit, LoginUser.execute)
router.get("/user", HttpAuthenticationMiddlewware, standardRateLimit, GetUserData.execute);
router.post("/logout", HttpAuthenticationMiddlewware, strictRateLimit, LogOut.execute);

router.post("/chat", HttpAuthenticationMiddlewware, strictRateLimit, CreateChat.execute);
router.get("/chat/:id", HttpAuthenticationMiddlewware, standardRateLimit, GetChats.execute);
router.get("/chat/search/:userid", HttpAuthenticationMiddlewware, standardRateLimit, SearchChat.execute);

export default router;