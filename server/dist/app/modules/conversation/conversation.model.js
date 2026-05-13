"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conversation = void 0;
const mongoose_1 = require("mongoose");
const conversationSchema = new mongoose_1.Schema({
    participants: { type: [mongoose_1.Schema.Types.ObjectId] },
    messages: { type: [mongoose_1.Schema.Types.ObjectId], default: [] },
}, { timestamps: true });
exports.Conversation = (0, mongoose_1.model)("Conversation", conversationSchema);
