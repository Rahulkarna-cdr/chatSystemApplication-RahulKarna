import express from "express";
import { createChat, getChats } from "../controllers/chat.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateToken, createChat)
router.get("/", authenticateToken, getChats);

export default router;
