const { Server } = require("socket.io");

const io = new Server({
  cors: {
    origin: "http://localhost:5173", // Correctly set up CORS
  },
});

let onlineUsers = []; // Renamed to onlineUsers for clarity

io.on("connection", (socket) => {
  console.log("New connection", socket.id);

  socket.on("addNewUser", (userE) => {
    // Add the new user if not already present
    if (!onlineUsers.some((user) => user.userE === userE)) {
      onlineUsers.push({
        userE,
        socketId: socket.id,
      });
    }
    console.log("Updated online users:", onlineUsers); // Log inside the event
    io.emit("getOnlineUsers", onlineUsers);
  });

  //add message
  socket.on("sendMessage", (message)=>{
    const user = onlineUsers.find((user)=>user.userE === message.ids)
    console.log("recipeint id",message.ids, message)
    console.log("user id", user)
  //  console.log("Sad", message, user)
    if(user){
        io.to(user.socketId).emit("getMessage", message)
    }
  })

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

// Start listening for connections
io.listen(1497);

console.log(`Server is running on port 1497`);
