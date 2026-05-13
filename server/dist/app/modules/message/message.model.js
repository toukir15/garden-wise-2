"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    conversationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Conversation",
        required: false,
    },
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    isSeen: {
        type: Map,
        of: Boolean,
    },
    isRemove: {
        type: Map,
        of: Boolean,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isEdited: {
        type: Boolean,
        default: false,
    },
    reply: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
});
exports.Message = (0, mongoose_1.model)("Message", messageSchema);
