import express from "express";
const router = express.Router({ strict: true, caseSensitive: true });

import CreateNewUser from "./user/CreateNewUser";
import LoginUser from "./user/LoginUser";
import GetUserData from "./user/GetUserData";
import TokenCheckings from "./middlewares/TokenCheckings";
import { standardRateLimit, strictRateLimit } from "./middlewares/RateLimiting";

router.post("/register", strictRateLimit, CreateNewUser.execute);
router.post("/login", strictRateLimit, LoginUser.execute)
router.get("/user", TokenCheckings, standardRateLimit, GetUserData.execute);

export default router;