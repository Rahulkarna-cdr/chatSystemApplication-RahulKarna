import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import config from "./config/config.js";
// import { createServer } from "http";

const app = express();
// const httpServer = createServer(app)
const PORT = config.PORT;

// const io = new Server(httpServer,{
//     cors:{
//         origin:"*",
//         methods:["GET", "POST"],
//         credentials:true
//     }
// })
// // initateSocket(io)

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

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
