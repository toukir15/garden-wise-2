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
    // আগের socketId থাকলে সেটাকে মুছে নতুনটা যোগ করবো
    activeUsers.forEach((user, index) => {
      if (user._id === data._id) {
        activeUsers.splice(index, 1); // পুরোনো এন্ট্রি মুছে ফেলি
      }
    });

    // নতুন socketId সহ ইউজার যোগ করলাম
    activeUsers.push({ ...data, socketId: socket.id });

    // সকল অনলাইন ইউজারদের আপডেট পাঠাচ্ছি
    socket.emit("online", activeUsers);
    socket.broadcast.emit("online", activeUsers);
  });

  socket.on("disconnect", () => {
    const index = activeUsers.findIndex((user) => user.socketId === socket.id);
    if (index !== -1) {
      activeUsers.splice(index, 1);
      console.log(`User disconnected: ${socket.id}`);

      // সকলে নতুন অনলাইন লিস্ট পাঠানো
      socket.broadcast.emit("online", activeUsers);
    }
  });
};
