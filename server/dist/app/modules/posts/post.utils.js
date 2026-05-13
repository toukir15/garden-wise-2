"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.populateOptions = exports.sortPopularPosts = exports.filterPostsForUnverifiedUser = exports.getSortOrderPipeline = exports.createBaseQuery = void 0;
const post_const_1 = require("./post.const");
const createBaseQuery = (searchTerm, queryTerm, user) => {
    const baseQuery = {
        $or: post_const_1.postSearchableField.map(field => ({
            [field]: { $regex: searchTerm, $options: 'i' },
        })),
    };
    if (queryTerm === 'premium') {
        baseQuery['post.isPremium'] = true;
    }
    return baseQuery;
};
exports.createBaseQuery = createBaseQuery;
const getSortOrderPipeline = (queryTerm) => {
    if (queryTerm === 'recent' ||
        queryTerm === 'premium' ||
        queryTerm === 'popular') {
        return [{ $sort: { createdAt: -1 } }];
    }
    return [];
};
exports.getSortOrderPipeline = getSortOrderPipeline;
// Filter posts for unverified users
const filterPostsForUnverifiedUser = (posts, user) => {
    const isUserPost = (post) => { var _a; return !post.isShared && user._id == ((_a = post.post) === null || _a === void 0 ? void 0 : _a.user._id); };
    const isOtherNonPremiumPost = (post) => { var _a; return !post.isShared && !((_a = post.post) === null || _a === void 0 ? void 0 : _a.isPremium); };
    const isUserSharedPost = (post) => post.isShared && user._id == post.sharedUser._id;
    return posts.filter(post => isUserPost(post) || isOtherNonPremiumPost(post) || isUserSharedPost(post));
};
exports.filterPostsForUnverifiedUser = filterPostsForUnverifiedUser;
// Sort posts by popularity
const sortPopularPosts = (posts) => {
    return posts
        .map(post => {
        const totalUpvote = post.isShared
            ? post.votes.upvote.length
            : post.post.votes.upvote.length;
        return Object.assign(Object.assign({}, post), { totalUpvote });
    })
        .sort((a, b) => b.totalUpvote - a.totalUpvote);
};
exports.sortPopularPosts = sortPopularPosts;
exports.populateOptions = [
    {
        path: 'sharedUser',
        model: 'User',
        select: 'name profilePhoto isVerified email address',
    },
    {
        path: 'votes',
        model: 'Vote',
        select: 'upvote downvote',
    },
    {
        path: 'comments',
        model: 'Comment',
        select: 'text user votes replies createdAt',
        populate: [
            {
                path: 'user',
                model: 'User',
                select: 'name profilePhoto isVerified email address',
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
        select: 'name profilePhoto isVerified email address',
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
];
