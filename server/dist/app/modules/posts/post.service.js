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
exports.PostServices = exports.getPostsFromDB = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../user/user.model");
const vote_model_1 = require("../vote/vote.model");
const post_model_1 = __importDefault(require("./post.model"));
const comment_model_1 = require("../comment/comment.model");
const post_utils_1 = require("./post.utils");
const createPostIntoDB = (payload, postImages, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const findUser = yield user_model_1.User.findById(userId);
    if (!findUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User does not exist');
    }
    const createVotes = yield vote_model_1.Vote.create({});
    const findVote = yield vote_model_1.Vote.findById(createVotes._id);
    const postData = {
        post: Object.assign(Object.assign({}, payload), { user: userId, votes: findVote, images: postImages }),
    };
    const result = yield post_model_1.default.create(postData);
    const resultObject = result.toObject();
    const userObject = findUser.toObject();
    const modifyResult = Object.assign(Object.assign({}, resultObject), { post: Object.assign(Object.assign({}, resultObject === null || resultObject === void 0 ? void 0 : resultObject.post), { user: {
                _id: userObject === null || userObject === void 0 ? void 0 : userObject._id,
                name: userObject === null || userObject === void 0 ? void 0 : userObject.name,
                profilePhoto: userObject === null || userObject === void 0 ? void 0 : userObject.profilePhoto,
                email: userObject === null || userObject === void 0 ? void 0 : userObject.email,
            } }) });
    return modifyResult;
});
const createSharePostIntoDB = (postId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const createVotes = yield vote_model_1.Vote.create({});
    const findVote = yield vote_model_1.Vote.findById(createVotes._id);
    const findPost = yield post_model_1.default.findById(postId);
    const sharePostData = {
        description: payload.description,
        isShared: true,
        post: findPost.post,
        sharedUser: userId,
        votes: findVote,
    };
    const result = yield post_model_1.default.create(sharePostData);
    return result;
});
const getPostsFromDB = (query, user) => __awaiter(void 0, void 0, void 0, function* () {
    const searchTerm = (query === null || query === void 0 ? void 0 : query.searchTerm) || '';
    const queryTerm = (query === null || query === void 0 ? void 0 : query.queryTerm) || '';
    const baseQuery = (0, post_utils_1.createBaseQuery)(searchTerm, queryTerm, user);
    const sortPipeline = (0, post_utils_1.getSortOrderPipeline)(queryTerm);
    const pipeline = [
        { $match: baseQuery },
        ...sortPipeline,
        {
            $project: {
                sharedUser: 1,
                description: 1,
                votes: 1,
                isShared: 1,
                comments: 1,
                share: 1,
                post: 1,
                createdAt: 1,
            },
        },
    ];
    // Execute aggregation
    let result = yield post_model_1.default.aggregate(pipeline).exec();
    // Populate fields
    yield post_model_1.default.populate(result, post_utils_1.populateOptions);
    // Apply additional filters for unverified users
    if (!user.isVerified) {
        result = (0, post_utils_1.filterPostsForUnverifiedUser)(result, user);
    }
    // Sort by popularity if the query term is 'popular'
    if (queryTerm === 'popular' || searchTerm || queryTerm === 'premium') {
        result = (0, post_utils_1.sortPopularPosts)(result);
    }
    return result;
});
exports.getPostsFromDB = getPostsFromDB;
const getVisitProfilePostsFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.find({
        $or: [
            { isShared: true, sharedUser: userId },
            { isShared: false, 'post.user': userId },
        ],
    })
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
    })
        .sort({ createdAt: -1 });
    return result;
});
const getMyPostsFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.find({
        $or: [
            { isShared: true, sharedUser: userId },
            { isShared: false, 'post.user': userId },
        ],
    })
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
    })
        .sort({ createdAt: -1 });
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
const deletePostFromDB = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.findByIdAndDelete(postId);
    return result;
});
const updatePostIntoDB = (postId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const findPost = yield post_model_1.default.findById(postId);
    const findPostObject = findPost === null || findPost === void 0 ? void 0 : findPost.toObject();
    if (!findPost) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Post does not exist');
    }
    let updatedData;
    if (findPost.isShared) {
        updatedData = payload;
    }
    else {
        updatedData = {
            post: Object.assign(Object.assign({}, findPostObject.post), payload),
        };
    }
    const result = yield post_model_1.default.findByIdAndUpdate(postId, updatedData, {
        new: true,
    });
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
    getMyPostsFromDB,
    createCommentReplyIntoDB,
    deletePostFromDB,
    updatePostIntoDB,
    updateUpvoteIntoDB,
    updateDownvoteIntoDB,
    getPostsFromDB: exports.getPostsFromDB,
    createSharePostIntoDB,
    getPostFromDB,
    getVisitProfilePostsFromDB,
};
