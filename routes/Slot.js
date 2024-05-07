import { Router } from "express";
import { bookSlot, getAllSlots } from "../controllers/Slot.js";

const router = Router();

router.route("/").get(getAllSlots);

router.post("/book", bookSlot);

export default router;
