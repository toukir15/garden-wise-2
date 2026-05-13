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
exports.CommentServices = void 0;
const http_status_1 = require("http-status");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const post_model_1 = __importDefault(require("../posts/post.model"));
const user_model_1 = require("../user/user.model");
const vote_model_1 = require("../vote/vote.model");
const comment_model_1 = require("./comment.model");
const createCommentIntoDB = (payload, postId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // find user exist or not
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.BAD_REQUEST, "User doesn't exist!");
    }
    // find post
    const findPost = yield post_model_1.default.findById(postId);
    if (!findPost) {
        throw new AppError_1.default(http_status_1.BAD_REQUEST, 'Post no longer available!');
    }
    // create votes
    const createVotes = yield vote_model_1.Vote.create({});
    if (createVotes === null || createVotes === void 0 ? void 0 : createVotes._id) {
        payload.votes = createVotes === null || createVotes === void 0 ? void 0 : createVotes._id;
    }
    // set user id
    payload.user = user === null || user === void 0 ? void 0 : user._id;
    const result = yield comment_model_1.Comment.create(payload);
    //   update post coment id
    if (findPost.isShared) {
        yield post_model_1.default.findByIdAndUpdate(postId, {
            $push: { comments: result === null || result === void 0 ? void 0 : result._id },
        });
    }
    else {
        yield post_model_1.default.findByIdAndUpdate(postId, {
            $push: { 'post.comments': result === null || result === void 0 ? void 0 : result._id },
        });
    }
    return result;
});
const updateCommentIntoDB = (payload, commentId) => __awaiter(void 0, void 0, void 0, function* () {
    const findComment = yield comment_model_1.Comment.findById(commentId);
    if (!findComment) {
        throw new AppError_1.default(http_status_1.BAD_REQUEST, 'Comment no longer available!');
    }
    const result = yield comment_model_1.Comment.findByIdAndUpdate(commentId, payload, {
        new: true,
    });
    return result;
});
const deleteCommentFromDB = (commentId, postId) => __awaiter(void 0, void 0, void 0, function* () {
    const findPost = yield post_model_1.default.findById(postId);
    if (!findPost) {
        throw new AppError_1.default(http_status_1.BAD_REQUEST, 'Post no longer available!');
    }
    const findComment = yield comment_model_1.Comment.findById(commentId);
    if (!findComment) {
        throw new AppError_1.default(http_status_1.BAD_REQUEST, 'Comment no longer available!');
    }
    if (findPost.isShared) {
        yield post_model_1.default.findByIdAndUpdate(postId, { $pull: { comments: commentId } });
    }
    else {
        yield post_model_1.default.findByIdAndUpdate(postId, {
            $pull: { 'post.comments': commentId },
        });
    }
    const result = yield comment_model_1.Comment.findByIdAndDelete(commentId);
    return result;
});
exports.CommentServices = {
    createCommentIntoDB,
    updateCommentIntoDB,
    deleteCommentFromDB,
};
