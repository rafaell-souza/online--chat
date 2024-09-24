import express from "express";
const router = express.Router({ strict: true, caseSensitive: true });

import CreateNewUser from "./user/CreateNewUser";
import LoginUser from "./user/LoginUser";

router.post("/register", CreateNewUser.execute);
router.post("/login", LoginUser.execute)

export default router;