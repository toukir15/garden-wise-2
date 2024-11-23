"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_const_1 = require("../user/user.const");
const bookmark_controller_1 = require("./bookmark.controller");
const router = express_1.default.Router();
router.patch('/:bookmarkId', (0, auth_1.default)(user_const_1.USER_ROLE.user, user_const_1.USER_ROLE.admin), bookmark_controller_1.BookmarkController.updateBookmark);
router.get('/', (0, auth_1.default)(user_const_1.USER_ROLE.user, user_const_1.USER_ROLE.admin), bookmark_controller_1.BookmarkController.getBookmark);
exports.BookmarkRouter = router;
