import { Router } from "express";

import { loginUser, registerUser } from "../controllers/User.js";

const router = Router();

router.route("/").post(registerUser);

router.route("/login").post(loginUser);

export default router;
