import { Router } from "express";
import { AdminLogin, getAllUsers } from "../controllers/Admin.js";
import { isAdmin } from "../middlewares/authHandler.js";
import { createDrive } from "../controllers/Drive.js";

const router = Router();

router.route("/").post(AdminLogin);

router.route('/users').get(isAdmin, getAllUsers);

router.route("/drives").post(isAdmin, createDrive);

export default router;
