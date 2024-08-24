const { Server } = require("socket.io");

const io = new Server({
  cors: {
    origin: "*",  // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],  // Allow all methods
    allowedHeaders: ["*"],  // Allow all headers
    credentials: true  // Allow credentials
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("New connection", socket.id);

  socket.on("addNewUser", (userE) => {
    if (!onlineUsers.some((user) => user.userE === userE)) {
      onlineUsers.push({
        userE,
        socketId: socket.id,
      });
    }
    console.log("Updated online users:", onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find((user) => user.userE === message.ids);
    console.log("recipient id", message.ids, message);
    console.log("user id", user);
    if (user) {
      io.to(user.socketId).emit("getMessage", message);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(1497);
console.log(`Server is running on port 1497`);