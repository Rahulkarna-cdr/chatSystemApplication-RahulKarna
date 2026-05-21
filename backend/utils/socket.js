const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Step 1: User opens the app
    // Client emits: socket.emit("setup", userId)
    // Server creates a personal room for this user using their userId
    // This room is used later to notify a user even when they aren't in a specific chat
    socket.on("setup", (userId) => {
      socket.join(userId);
      socket.emit("connected"); // tells client the setup is done
      console.log("User joined personal room:", userId);
    });

    // Step 2: User opens a specific chat
    // Client emits: socket.emit("join-chat", chatId)
    // Server puts this socket into that chat's room
    // Now anything emitted to io.to(chatId) reaches this user
    socket.on("join-chat", (chatId) => {
      socket.join(chatId);
      console.log("User joined chat room:", chatId);
    });

    // Step 3: User sends a message
    // Client emits: socket.emit("new-message", savedMessage)
    // savedMessage is the fully populated message object returned from your HTTP POST
    // Server broadcasts it to everyone in that chat's room EXCEPT the sender
    socket.on("new-message", (savedMessage) => {
      const chat = savedMessage.chat;

      if (!chat || !chat.users) {
        console.log("chat or chat.users not defined");
        return;
      }

      // emit to every user in the chat room except the sender
      socket.to(chat._id.toString()).emit("message-received", savedMessage);
    });

    // Step 4: Typing indicators
    // Client emits: socket.emit("typing", chatId)
    // Server tells everyone else in that chat that someone is typing
    socket.on("typing", (chatId) => {
      socket.to(chatId).emit("typing");
    });

    socket.on("stop-typing", (chatId) => {
      socket.to(chatId).emit("stop-typing");
    });

    // Step 5: User closes the app / disconnects
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default initSocket;