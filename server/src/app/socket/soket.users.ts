import { Socket } from "socket.io";

interface ActiveUser {
  _id: string;
  socketId: string;
}

// Active user list
export const activeUsers: ActiveUser[] = [];

// Find user function
export const getFindUser = (userId: string) => {
  return activeUsers.find((user) => user._id === userId);
};

export const users = (socket: Socket) => {
  socket.on("user", (data: Omit<ActiveUser, "socketId">) => {
    activeUsers.forEach((user, index) => {
      if (user._id === data._id) {
        activeUsers.splice(index, 1);
      }
    });

    activeUsers.push({ ...data, socketId: socket.id });

    socket.emit("online", activeUsers);
    socket.broadcast.emit("online", activeUsers);
  });

  socket.on("disconnect", () => {
    const index = activeUsers.findIndex((user) => user.socketId === socket.id);
    if (index !== -1) {
      activeUsers.splice(index, 1);
      console.log(`User disconnected: ${socket.id}`);

      socket.broadcast.emit("online", activeUsers);
    }
  });
};
