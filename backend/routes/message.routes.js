import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/:chatId", authenticateToken, getMessages);
router.post("/", authenticateToken, sendMessage);

export default router;
