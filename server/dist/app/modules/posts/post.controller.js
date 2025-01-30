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
exports.PostControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = require("../../utils/catchAsync");
const post_service_1 = require("./post.service");
const createPost = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const post = JSON.parse(req.body.data);
    const files = req === null || req === void 0 ? void 0 : req.files;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const postImages = files === null || files === void 0 ? void 0 : files.map(file => file === null || file === void 0 ? void 0 : file.path);
    const result = yield post_service_1.PostServices.createPostIntoDB(post, postImages, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Created post successfully!',
        data: result,
    });
}));
const createSharePost = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const postId = req.params.postId;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const data = req.body;
    const result = yield post_service_1.PostServices.createSharePostIntoDB(postId, userId, data);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Created post successfully!',
        data: result,
    });
}));
const updatePost = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    const payload = req.body;
    const result = yield post_service_1.PostServices.updatePostIntoDB(postId, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'update post successfully!',
        data: result,
    });
}));
const deletePost = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    const result = yield post_service_1.PostServices.deletePostFromDB(postId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Delete post successfully!',
        data: result,
    });
}));
const getPosts = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const user = req.user;
    const result = yield post_service_1.PostServices.getPostsFromDB(query, user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Posts retrive successfully!',
        data: result,
    });
}));
const getMyPosts = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const result = yield post_service_1.PostServices.getMyPostsFromDB(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'My posts retrive successfully!',
        data: result,
    });
}));
const getVisitProfilePosts = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const result = yield post_service_1.PostServices.getMyPostsFromDB(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'My posts retrive successfully!',
        data: result,
    });
}));
const getPost = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    const result = yield post_service_1.PostServices.getPostFromDB(postId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Post retrive successfully!',
        data: result,
    });
}));
const createCommentReply = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const data = req.body;
    const commentId = req.params.commentId;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const result = yield post_service_1.PostServices.createCommentReplyIntoDB(data, commentId, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Created comment reply successfully!',
        data: result,
    });
}));
const updateUpvote = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const voteId = req.params.voteId;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const result = yield post_service_1.PostServices.updateUpvoteIntoDB(userId, voteId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Upvoted comment successfully!',
        data: result,
    });
}));
const updateDownvote = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const voteId = req.params.voteId;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const result = yield post_service_1.PostServices.updateDownvoteIntoDB(userId, voteId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Downvote comment successfully!',
        data: result,
    });
}));
exports.PostControllers = {
    createPost,
    createCommentReply,
    deletePost,
    updateUpvote,
    updateDownvote,
    getPosts,
    createSharePost,
    getPost,
    getMyPosts,
    updatePost,
    getVisitProfilePosts,
};
