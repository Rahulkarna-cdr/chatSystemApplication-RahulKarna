import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/:chatId")
router.route("/")

export default router;
