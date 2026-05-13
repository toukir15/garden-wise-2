import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { getFindUser, users } from "./soket.users";
import config from "../config";

let io: SocketIOServer;

export function initializeSocket(server: HTTPServer): SocketIOServer {
  io = new SocketIOServer(server, {
    cors: {
      origin: [config.client_url as string],
      methods: ["GET", "POST"],
      credentials: true
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
