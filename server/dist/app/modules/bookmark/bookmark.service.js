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
exports.BookmarkServices = void 0;
const mongoose_1 = require("mongoose");
const bookmark_model_1 = __importDefault(require("./bookmark.model"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const updateBookmarkIntoDB = (bookmarkId, postId) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch the bookmark to check if the postId already exists
    const bookmark = yield bookmark_model_1.default.findById(bookmarkId);
    if (!bookmark) {
        throw new Error('Bookmark not found');
    }
    // Check if the postId already exists in the posts array
    const covertedPostId = new mongoose_1.Types.ObjectId(postId);
    const postExists = bookmark.posts.includes(covertedPostId);
    // Update the bookmark based on whether the post exists
    const result = yield bookmark_model_1.default.findByIdAndUpdate(bookmarkId, postExists
        ? { $pull: { posts: postId } }
        : { $addToSet: { posts: postId } }, { new: true });
    return result;
});
const getBookmarkFromDB = (bookmarkId) => __awaiter(void 0, void 0, void 0, function* () {
    const findBookmark = yield bookmark_model_1.default.findById(bookmarkId);
    if (!findBookmark) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Bookmark is not found!');
    }
    const result = yield bookmark_model_1.default.findById(bookmarkId)
        .populate({
        path: 'posts',
        populate: [
            {
                path: 'sharedUser',
                model: 'User',
                select: 'name profilePhoto',
            },
            {
                path: 'votes',
                model: 'Vote',
                select: 'upvote downvote',
            },
            {
                path: 'comments',
                model: 'Comment',
                select: 'text votes replies user createdAt',
                populate: [
                    {
                        path: 'user',
                        model: 'User',
                        select: 'name profilePhoto',
                    },
                    {
                        path: 'replies.commentReplyUser',
                        model: 'User',
                        select: 'name profilePhoto',
                    },
                    {
                        path: 'replies.replyTo',
                        model: 'User',
                        select: 'name',
                    },
                    {
                        path: 'votes',
                        model: 'Vote',
                        select: 'upvote downvote',
                    },
                    {
                        path: 'replies.votes',
                        model: 'Vote',
                        select: 'upvote downvote',
                    },
                ],
            },
            {
                path: 'post.user',
                model: 'User',
                select: 'name profilePhoto',
            },
            {
                path: 'post.comments',
                model: 'Comment',
                select: 'text user votes replies createdAt',
                populate: [
                    {
                        path: 'user',
                        model: 'User',
                        select: 'name profilePhoto',
                    },
                    {
                        path: 'replies.commentReplyUser',
                        model: 'User',
                        select: 'name profilePhoto',
                    },
                    {
                        path: 'replies.replyTo',
                        model: 'User',
                        select: 'name',
                    },
                    {
                        path: 'votes',
                        model: 'Vote',
                        select: 'upvote downvote',
                    },
                    {
                        path: 'replies.votes',
                        model: 'Vote',
                        select: 'upvote downvote',
                    },
                ],
            },
            {
                path: 'post.votes',
                model: 'Vote',
                select: 'upvote downvote',
            },
        ],
    })
        .exec();
    return result;
});
exports.BookmarkServices = {
    updateBookmarkIntoDB,
    getBookmarkFromDB,
};
