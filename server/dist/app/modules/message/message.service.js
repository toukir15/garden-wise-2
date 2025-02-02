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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const conversation_model_1 = require("../conversation/conversation.model");
const user_model_1 = require("../user/user.model");
const message_model_1 = require("./message.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const createMessageIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Save the message into the database
        const createMessage = yield message_model_1.Message.create([payload], { session });
        // Check if a conversation with the same participants already exists
        let conversation = yield conversation_model_1.Conversation.findOne({
            participants: { $all: [createMessage[0].senderId, payload.receiverId] },
        }).session(session);
        // If no existing conversation, create a new one
        if (!conversation) {
            const [newConversation] = yield conversation_model_1.Conversation.create([
                {
                    participants: [createMessage[0].senderId, payload.receiverId],
                },
            ], { session });
            conversation = newConversation;
            // Update conversation IDs in the user collection
            yield user_model_1.User.findByIdAndUpdate(createMessage[0].senderId, { $addToSet: { conversations: conversation._id } }, { new: true, session });
            yield user_model_1.User.findByIdAndUpdate(payload.receiverId, { $addToSet: { conversations: conversation._id } }, { new: true, session });
        }
        // Update conversationId in the message collection
        const updateMessage = yield message_model_1.Message.findByIdAndUpdate(createMessage[0]._id, { conversationId: conversation._id }, { new: true, session });
        // push message id into coversation collection
        yield conversation_model_1.Conversation.findByIdAndUpdate(updateMessage === null || updateMessage === void 0 ? void 0 : updateMessage.conversationId, {
            $addToSet: { messages: updateMessage === null || updateMessage === void 0 ? void 0 : updateMessage._id },
        }, { session });
        // Commit the transaction
        yield session.commitTransaction();
        session.endSession();
        return updateMessage;
    }
    catch (error) {
        // Abort the transaction and rollback
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Provide inconsistant data");
    }
});
const getMessagesFromDB = (conversationId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield message_model_1.Message.find({ conversationId: conversationId });
    return result;
});
const deleteMessageFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
});
const updateMessageIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
});
const updateSeenStatusIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
});
exports.MessageServices = {
    createMessageIntoDB,
    deleteMessageFromDB,
    updateMessageIntoDB,
    updateSeenStatusIntoDB,
    getMessagesFromDB
};
