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
exports.ConversationControllers = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const conversation_service_1 = require("./conversation.service");
const catchAsync_1 = require("../../utils/catchAsync");
const createConversation = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const result = yield conversation_service_1.ConversationServices.createConversationIntoDB(req.body, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Retrive conversations successfully!",
        data: result,
    });
}));
const getConversations = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUser = req.user;
    const result = yield conversation_service_1.ConversationServices.getConversationsFromDB(currentUser);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Retrive conversations successfully!",
        data: result,
    });
}));
exports.ConversationControllers = {
    getConversations,
    createConversation
};
