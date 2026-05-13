"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_const_1 = require("../user/user.const");
const comment_controller_1 = require("./comment.controller");
const router = express_1.default.Router();
router.post('/:postId', (0, auth_1.default)(user_const_1.USER_ROLE.user, user_const_1.USER_ROLE.admin), comment_controller_1.CommentControllers.createComment);
router.patch('/:commentId', (0, auth_1.default)(user_const_1.USER_ROLE.user, user_const_1.USER_ROLE.admin), comment_controller_1.CommentControllers.updateComment);
router.put('/:commentId', (0, auth_1.default)(user_const_1.USER_ROLE.user, user_const_1.USER_ROLE.admin), comment_controller_1.CommentControllers.deleteComment);
exports.CommentRouter = router;
