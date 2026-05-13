"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = initializeSocket;
const socket_io_1 = require("socket.io");
const soket_users_1 = require("./soket.users");
const config_1 = __importDefault(require("../config"));
let io;
function initializeSocket(server) {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: [config_1.default.client_url],
            methods: ["GET", "POST"],
            credentials: true
        },
    });
    io.on("connection", (socket) => {
        console.log("New connection");
        (0, soket_users_1.users)(socket);
        socket.on("message", (data) => {
            const findUser = (0, soket_users_1.getFindUser)(data.receiverId);
            socket.to(findUser === null || findUser === void 0 ? void 0 : findUser.socketId).emit("message", data.conversationId);
        });
        socket.on("conversation", (data) => {
            const findUser = (0, soket_users_1.getFindUser)(data.receiverId);
            socket.to(findUser === null || findUser === void 0 ? void 0 : findUser.socketId).emit("conversation", data);
        });
        socket.on("typing", (data) => {
            const findUser = (0, soket_users_1.getFindUser)(data.id);
            if (!findUser) {
                return;
            }
            console.log("object");
            socket.to(findUser === null || findUser === void 0 ? void 0 : findUser.socketId).emit("typing", data.isTyping);
        });
    });
    return io;
}
