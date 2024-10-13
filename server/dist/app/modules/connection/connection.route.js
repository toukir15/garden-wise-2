"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionRouter = void 0;
const express_1 = __importDefault(require("express"));
const connection_controller_1 = require("./connection.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_const_1 = require("../user/user.const");
const router = express_1.default.Router();
router.patch('/follow/:followUserId', (0, auth_1.default)(user_const_1.USER_ROLE.user, user_const_1.USER_ROLE.admin), connection_controller_1.ConnectionController.updateFollowConnection);
router.patch('/unfollow/:unfollowUserId', (0, auth_1.default)(user_const_1.USER_ROLE.user, user_const_1.USER_ROLE.admin), connection_controller_1.ConnectionController.updateUnfollowConnection);
exports.ConnectionRouter = router;
