import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import config from "./config/config.js";
import initSocket from "./utils/socket.js";

const app = express();
const httpServer = createServer(app);  // wrap express in an HTTP server
const PORT = config.PORT;

// socket.io attaches to the same HTTP server as express
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000, // close connection if no response in 60s — saves server resources
});

connectDB();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Chat system is healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

app.use(errorHandler);

// initialize all socket event listeners
initSocket(io);

// httpServer instead of app — because socket.io needs the raw HTTP server
httpServer.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});