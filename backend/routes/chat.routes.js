import express from "express";
import { createChat, getChats } from "../controllers/chat.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();


export default router;
