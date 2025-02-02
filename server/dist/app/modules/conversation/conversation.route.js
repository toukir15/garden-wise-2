"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationRouter = void 0;
const express_1 = require("express");
const conversation_controller_1 = require("./conversation.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_const_1 = require("../user/user.const");
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.default)(user_const_1.USER_ROLE.admin, user_const_1.USER_ROLE.user), conversation_controller_1.ConversationControllers.createConversation);
router.get("/", (0, auth_1.default)(user_const_1.USER_ROLE.admin, user_const_1.USER_ROLE.user), conversation_controller_1.ConversationControllers.getConversations);
exports.ConversationRouter = router;
