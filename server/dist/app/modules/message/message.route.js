"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRouter = void 0;
const express_1 = require("express");
const message_controller_1 = require("./message.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_const_1 = require("../user/user.const");
const router = (0, express_1.Router)();
router.post("/", message_controller_1.MessageControllers.createMessage);
router.get("/:conversationId", message_controller_1.MessageControllers.getMessages);
router.delete("/:messageId", (0, auth_1.default)(user_const_1.USER_ROLE.admin, user_const_1.USER_ROLE.user), message_controller_1.MessageControllers.deleteMessage);
router.patch("/:messageId", message_controller_1.MessageControllers.updateMessage);
router.patch("/seen/:conversationId/:receiverId", (0, auth_1.default)(user_const_1.USER_ROLE.admin, user_const_1.USER_ROLE.user), message_controller_1.MessageControllers.updateSeenStatus);
exports.MessageRouter = router;
