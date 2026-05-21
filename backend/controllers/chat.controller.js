import Chat from "../models/Chat.model.js";
import User from "../models/User.model.js";

export const createChat = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "UserId param not sent with request" });
    }

    let existingChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    existingChat = await User.populate(existingChat, {
      path: "latestMessage.sender",
      select: "name email",
    });

    if (existingChat.length > 0) {
      return res.status(200).json(existingChat[0]);
    }

    const createdChat = await Chat.create({
      isGroupChat: false,
      users: [req.user._id, userId],
    });

    const fullChat = await Chat.findById(createdChat._id).populate("users", "-password");

    return res.status(201).json(fullChat);

  } catch (err) {
    next(err);
  }
};

export const getChats = async (req, res, next) => {
  try {
    await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name email",
        });
        res.status(200).send(results);
      });
  } catch (err) {
    next(err);
  }
};
