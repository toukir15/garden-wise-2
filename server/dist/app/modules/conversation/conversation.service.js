"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationServices = void 0;
const conversation_model_1 = require("./conversation.model");
const user_model_1 = require("../user/user.model");
const createConversationIntoDB = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield conversation_model_1.Conversation.create({ participants: [payload.otherUserId, userId] });
    yield user_model_1.User.findByIdAndUpdate(userId, { $addToSet: { conversations: result._id } });
    yield user_model_1.User.findByIdAndUpdate(payload.otherUserId, { $addToSet: { conversations: result._id } });
    return result;
});
const getConversationsFromDB = (currentUser) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(currentUser._id);
    if (!user)
        return [];
    const conversations = yield conversation_model_1.Conversation.find({
        _id: { $in: user.conversations }
    })
        .populate({
        path: "messages",
        model: "Message",
    })
        .populate({
        path: "participants",
        model: "User",
    });
    const sortedConversation = conversations.sort((a, b) => new Date(b === null || b === void 0 ? void 0 : b.createdAt).getTime() - new Date(a === null || a === void 0 ? void 0 : a.createdAt).getTime());
    const formattedConversations = sortedConversation.map((conversation) => {
        var _a, _b, _c, _d, _e, _f;
        const sortedMessages = conversation.messages.sort((a, b) => new Date(b === null || b === void 0 ? void 0 : b.createdAt).getTime() - new Date(a === null || a === void 0 ? void 0 : a.createdAt).getTime());
        const otherParticipant = conversation.participants.find((participant) => participant._id.toString() !== user._id.toString());
        return {
            _id: conversation._id,
            otherParticipant: {
                _id: otherParticipant._id,
                name: otherParticipant.name,
                profilePhoto: otherParticipant.profilePhoto
            },
            lastMessage: {
                _id: (_a = sortedMessages[0]) === null || _a === void 0 ? void 0 : _a._id,
                text: (_b = sortedMessages[0]) === null || _b === void 0 ? void 0 : _b.text,
                senderId: (_c = sortedMessages[0]) === null || _c === void 0 ? void 0 : _c.senderId,
                isSeen: (_d = sortedMessages[0]) === null || _d === void 0 ? void 0 : _d.isSeen,
                isRemove: (_e = sortedMessages[0]) === null || _e === void 0 ? void 0 : _e.isRemove,
                createdAt: (_f = sortedMessages[0]) === null || _f === void 0 ? void 0 : _f.createdAt,
            },
        };
    });
    formattedConversations.sort((a, b) => { var _a, _b; return new Date((_a = b === null || b === void 0 ? void 0 : b.lastMessage) === null || _a === void 0 ? void 0 : _a.createdAt).getTime() - new Date((_b = a === null || a === void 0 ? void 0 : a.lastMessage) === null || _b === void 0 ? void 0 : _b.createdAt).getTime(); });
    return formattedConversations;
});
exports.ConversationServices = {
    getConversationsFromDB,
    createConversationIntoDB
};
