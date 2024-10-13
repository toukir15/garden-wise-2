"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.PostServices = void 0;
const http_status_1 = __importStar(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../user/user.model");
const vote_model_1 = require("../vote/vote.model");
const post_model_1 = __importDefault(require("./post.model"));
const comment_model_1 = require("../comment/comment.model");
const createPostIntoDB = (payload, postImages, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const createVotes = yield vote_model_1.Vote.create({});
    const postData = {
        post: Object.assign(Object.assign({}, payload), { user: userId, votes: createVotes === null || createVotes === void 0 ? void 0 : createVotes._id, images: postImages }),
    };
    const result = yield post_model_1.default.create(postData);
    return result;
});
const createSharePostIntoDB = (postId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const createVotes = yield vote_model_1.Vote.create({});
    const findPost = yield post_model_1.default.findById(postId);
    const sharePostData = {
        description: payload.description,
        isShared: true,
        post: findPost.post,
        sharedUser: userId,
        votes: createVotes === null || createVotes === void 0 ? void 0 : createVotes._id,
    };
    const result = yield post_model_1.default.create(sharePostData);
    return result;
});
const getPostsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.find()
        .select({
        sharedUser: 1,
        description: 1,
        votes: 1,
        isShared: 1,
        comments: 1,
        share: 1,
        post: 1,
        createdAt: 1,
    })
        .populate({
        path: 'sharedUser',
        model: 'User',
        select: 'name profilePhoto',
    })
        .populate({
        path: 'votes',
        model: 'Vote',
        select: 'upvote downvote',
    })
        .populate({
        path: 'comments',
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
    })
        .populate({
        path: 'post.user',
        model: 'User',
        select: 'name profilePhoto',
    })
        .populate({
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
    })
        .populate({
        path: 'post.votes',
        model: 'Vote',
        select: 'upvote downvote',
    });
    return result;
});
const getPostFromDB = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.findById(postId)
        .select({
        sharedUser: 1,
        description: 1,
        votes: 1,
        isShared: 1,
        comments: 1,
        share: 1,
        post: 1,
        createdAt: 1,
    })
        .populate({
        path: 'sharedUser',
        model: 'User',
        select: 'name profilePhoto',
    })
        .populate({
        path: 'votes',
        model: 'Vote',
        select: 'upvote downvote',
    })
        .populate({
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
    })
        .populate({
        path: 'post.user',
        model: 'User',
        select: 'name profilePhoto',
    })
        .populate({
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
    })
        .populate({
        path: 'post.votes',
        model: 'Vote',
        select: 'upvote downvote',
    });
    return result;
});
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
const createCommentReplyIntoDB = (payload, commentId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // find comment exist or not
    const findComment = yield comment_model_1.Comment.findById(commentId);
    if (!findComment) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Doesn't find comment!");
    }
    // check user exist or not
    const findUser = yield user_model_1.User.findById(userId);
    if (!findUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User does not exist');
    }
    // create votes
    const createVotes = yield vote_model_1.Vote.create({});
    if (createVotes === null || createVotes === void 0 ? void 0 : createVotes._id) {
        payload.votes = createVotes === null || createVotes === void 0 ? void 0 : createVotes._id;
    }
    payload.commentReplyUser = findUser === null || findUser === void 0 ? void 0 : findUser._id;
    payload.replyTo = findComment.user;
    const result = yield comment_model_1.Comment.findByIdAndUpdate(commentId, {
        $push: { replies: payload },
    });
    return result;
});
const updateUpvoteIntoDB = (userId, voteId) => __awaiter(void 0, void 0, void 0, function* () {
    // check user exist or not
    const findUser = yield user_model_1.User.findById(userId);
    if (!findUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User doesn't exist!");
    }
    // check vote exist or not
    const findVote = yield vote_model_1.Vote.findById(voteId);
    if (!findVote) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Vote doesn't exist!");
    }
    let result;
    if (!findVote.upvote.includes(findUser === null || findUser === void 0 ? void 0 : findUser._id)) {
        // if downvoted then remove downvote
        if (findVote.downvote.includes(findUser === null || findUser === void 0 ? void 0 : findUser._id)) {
            yield vote_model_1.Vote.findByIdAndUpdate(voteId, {
                $pull: { downvote: findUser === null || findUser === void 0 ? void 0 : findUser._id },
            }, { new: true });
        }
        // push upvote inside upvoted array
        result = yield vote_model_1.Vote.findByIdAndUpdate(voteId, {
            $push: { upvote: findUser === null || findUser === void 0 ? void 0 : findUser._id },
        }, { new: true });
    }
    else {
        result = yield vote_model_1.Vote.findByIdAndUpdate(voteId, {
            $pull: { upvote: findUser === null || findUser === void 0 ? void 0 : findUser._id },
        }, { new: true });
    }
    return result;
});
const updateDownvoteIntoDB = (userId, voteId) => __awaiter(void 0, void 0, void 0, function* () {
    // check user exist or not
    const findUser = yield user_model_1.User.findById(userId);
    if (!findUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User doesn't exist!");
    }
    // check vote exist or not
    const findVote = yield vote_model_1.Vote.findById(voteId);
    if (!findVote) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Vote doesn't exist!");
    }
    let result;
    if (!findVote.downvote.includes(findUser === null || findUser === void 0 ? void 0 : findUser._id)) {
        // if downvoted then remove downvote
        if (findVote.upvote.includes(findUser === null || findUser === void 0 ? void 0 : findUser._id)) {
            yield vote_model_1.Vote.findByIdAndUpdate(voteId, {
                $pull: { upvote: findUser === null || findUser === void 0 ? void 0 : findUser._id },
            }, { new: true });
        }
        // push upvote inside upvoted array
        result = yield vote_model_1.Vote.findByIdAndUpdate(voteId, {
            $push: { downvote: findUser === null || findUser === void 0 ? void 0 : findUser._id },
        }, { new: true });
    }
    else {
        result = yield vote_model_1.Vote.findByIdAndUpdate(voteId, {
            $pull: { downvote: findUser === null || findUser === void 0 ? void 0 : findUser._id },
        }, { new: true });
    }
    return result;
});
exports.PostServices = {
    createPostIntoDB,
    createCommentIntoDB,
    createCommentReplyIntoDB,
    updateUpvoteIntoDB,
    updateDownvoteIntoDB,
    getPostsFromDB,
    createSharePostIntoDB,
    getPostFromDB,
};
