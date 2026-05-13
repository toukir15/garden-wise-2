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
exports.MessageControllers = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const message_service_1 = require("./message.service");
const catchAsync_1 = require("../../utils/catchAsync");
const createMessage = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const messageData = req.body;
    const result = yield message_service_1.MessageServices.createMessageIntoDB(messageData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Send message successfully!",
        data: result,
    });
}));
const getMessages = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield message_service_1.MessageServices.getMessagesFromDB(req.params.conversationId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Messages retrive successfully!",
        data: result,
    });
}));
const deleteMessage = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const messageId = req.params.messageId;
    const query = req.query;
    const userId = req.user._id;
    const result = yield message_service_1.MessageServices.deleteMessageFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Delete message successfully!",
        data: result,
    });
}));
const updateMessage = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const messageId = req.params.messageId;
    const newMessage = req.body.newMessage;
    const result = yield message_service_1.MessageServices.updateMessageIntoDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Update message successfully!",
        data: result,
    });
}));
const updateSeenStatus = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const conversationId = req.params.conversationId;
    const receiverId = req.params.receiverId;
    const result = yield message_service_1.MessageServices.updateSeenStatusIntoDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Update message seen status successfully!",
        data: result,
    });
}));
exports.MessageControllers = {
    createMessage,
    deleteMessage,
    updateMessage,
    updateSeenStatus,
    getMessages
};
