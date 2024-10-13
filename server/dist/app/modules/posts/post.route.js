"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRouter = void 0;
const express_1 = __importDefault(require("express"));
const multer_config_1 = require("../../config/multer.config");
const post_controller_1 = require("./post.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_const_1 = require("../user/user.const");
const router = express_1.default.Router();
router.post('/', multer_config_1.multerUpload.array('file'), (0, auth_1.default)(user_const_1.USER_ROLE.user, user_const_1.USER_ROLE.admin), 
// validateRequest(AuthValidation.registerValidationSchema),
post_controller_1.PostControllers.createPost);
router.post('/share-post/:postId', (0, auth_1.default)(user_const_1.USER_ROLE.user, user_const_1.USER_ROLE.admin), post_controller_1.PostControllers.createSharePost);
router.get('/', post_controller_1.PostControllers.getPosts);
router.get('/:postId', post_controller_1.PostControllers.getPost);
router.post('/comment/:postId', (0, auth_1.default)(user_const_1.USER_ROLE.user, user_const_1.USER_ROLE.admin), post_controller_1.PostControllers.createComment);
router.post('/comment/reply/:commentId', (0, auth_1.default)(user_const_1.USER_ROLE.user, user_const_1.USER_ROLE.admin), post_controller_1.PostControllers.createCommentReply);
router.patch('/comment/upvote/:voteId', (0, auth_1.default)(user_const_1.USER_ROLE.user, user_const_1.USER_ROLE.admin), post_controller_1.PostControllers.updateUpvote);
router.patch('/comment/downvote/:voteId', (0, auth_1.default)(user_const_1.USER_ROLE.user, user_const_1.USER_ROLE.admin), post_controller_1.PostControllers.updateDownvote);
exports.PostRouter = router;
