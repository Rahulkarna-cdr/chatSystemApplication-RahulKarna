import express from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  newToken,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh-token", newToken);

export default router;
