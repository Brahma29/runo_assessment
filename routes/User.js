import { Router } from "express";

import { loginUser, registerSlot, registerUser, updateSlot } from "../controllers/User.js";
import { authHandler, isAdmin } from "../middlewares/authHandler.js";

const router = Router();

router.route("/").post(registerUser);

router.route("/login").post(loginUser);

router.route("/slot/book").post(authHandler, registerSlot);
router.route("/slot/update").patch(authHandler, updateSlot);

export default router;
