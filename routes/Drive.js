import { Router } from "express";
import { createDrive } from "../controllers/drive.js";

const router = Router();

router.route("/").post(createDrive);

export default router;
