import User from "../models/User.model.js";
import RefreshToken from "../models/RefreshToken.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const generateAccessToken = (payload) => {
  return jwt.sign(payload, config.ACCESS_TOKEN_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRY,
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.REFRESH_TOKEN_SECRET, {
    expiresIn: config.REFRESH_TOKEN_EXPIRY,
  });
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    //validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter valid credentials" });
    }

    //finding existing one
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    //hashing
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, email, password: hashPassword });

    const payload = { id: newUser.id };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await RefreshToken.create({
      token: refreshToken,
      userId: newUser.id,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: newUser.name,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter valid credentials" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //to check if user entered password is correct or not
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = { id: user.id };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await RefreshToken.create({
      token: refreshToken,
      userId: user.id,
    });

    return res.status(200).json({
      message: "Login successful",
      user: user.name,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

//getting a new Access Token when expired
export const newToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(403).json({ message: "Invalid Token" });
    }
    await new Promise((resolve, reject) => {
      jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) reject(err);
        else resolve(user);
      });
    });
    const refTokenInDb = await RefreshToken.findOne({ token: refreshToken });
    if (!refTokenInDb) {
      return res.status(403).json({ message: "Refresh token not found" });
    }

    const payload = { id: refTokenInDb.userId };
    const newAccessToken = generateAccessToken(payload);

    return res.status(200).json({
      message: "Access token generated successfully",
      accessToken: newAccessToken,
    });
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Invalid Token" });
    }

    const refTokenInDb = await RefreshToken.findOneAndDelete({
      token: refreshToken,
    });
    if (!refTokenInDb) {
      return res.status(400).json({ message: "Token not found" });
    }
    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    next(err);
  }
};
