"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = initializeSocket;
const socket_io_1 = require("socket.io");
const users_1 = require("./users");
let io;
function initializeSocket(server) {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: ["http://localhost:3000"],
            methods: ["GET", "POST"],
            credentials: true
        },
    });
    io.on("connection", (socket) => {
        console.log("New connection");
        (0, users_1.users)(socket);
        socket.on("message", (data) => {
            const findUser = (0, users_1.getFindUser)(data.receiverId);
            socket.to(findUser === null || findUser === void 0 ? void 0 : findUser.socketId).emit("message", data.conversationId);
        });
        socket.on("conversation", (data) => {
            const findUser = (0, users_1.getFindUser)(data.receiverId);
            socket.to(findUser === null || findUser === void 0 ? void 0 : findUser.socketId).emit("conversation", data);
        });
        socket.on("typing", (data) => {
            const findUser = (0, users_1.getFindUser)(data.id);
            if (!findUser) {
                return;
            }
            console.log("object");
            socket.to(findUser === null || findUser === void 0 ? void 0 : findUser.socketId).emit("typing", data.isTyping);
        });
    });
    return io;
}
