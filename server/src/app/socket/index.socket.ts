import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { getFindUser, users } from "./users";

let io: SocketIOServer;

export function initializeSocket(server: HTTPServer): SocketIOServer {
  io = new SocketIOServer(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New connection");
    users(socket);

    socket.on("message", (data) => {
      const findUser = getFindUser(data.receiverId);
      socket.to(findUser?.socketId as string).emit("message", data.conversationId);
    });


    socket.on("conversation", (data) => {
      const findUser = getFindUser(data.receiverId);
      socket.to(findUser?.socketId as string).emit("conversation", data);
    });

    socket.on("typing", (data) => {
      const findUser = getFindUser(data.id);
      if (!findUser) {
        return
      }
      console.log("object")
      socket.to(findUser?.socketId as string).emit("typing", data.isTyping);
    });
  });

  return io;
}
