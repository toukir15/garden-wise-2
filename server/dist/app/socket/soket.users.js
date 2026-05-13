"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = exports.getFindUser = exports.activeUsers = void 0;
// Active user list
exports.activeUsers = [];
// Find user function
const getFindUser = (userId) => {
    return exports.activeUsers.find((user) => user._id === userId);
};
exports.getFindUser = getFindUser;
const users = (socket) => {
    socket.on("user", (data) => {
        exports.activeUsers.forEach((user, index) => {
            if (user._id === data._id) {
                exports.activeUsers.splice(index, 1);
            }
        });
        exports.activeUsers.push(Object.assign(Object.assign({}, data), { socketId: socket.id }));
        socket.emit("online", exports.activeUsers);
        socket.broadcast.emit("online", exports.activeUsers);
    });
    socket.on("disconnect", () => {
        const index = exports.activeUsers.findIndex((user) => user.socketId === socket.id);
        if (index !== -1) {
            exports.activeUsers.splice(index, 1);
            console.log(`User disconnected: ${socket.id}`);
            socket.broadcast.emit("online", exports.activeUsers);
        }
    });
};
exports.users = users;
