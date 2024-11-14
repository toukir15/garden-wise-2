"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the schema for the sub-document `post`
const postSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.ObjectId, required: true, ref: 'User' },
    description: { type: String, required: true },
    images: { type: [String], required: true, default: [] },
    comments: { type: [mongoose_1.Schema.ObjectId], ref: 'Comment', default: [] },
    votes: { type: mongoose_1.Schema.ObjectId, ref: 'Vote', default: null },
    share: { type: [String], default: [] },
    isPremium: { type: Boolean, default: false },
    category: { type: String, required: true },
}, { timestamps: true });
// Define the main post schema
const postMainSchema = new mongoose_1.Schema({
    sharedUser: { type: mongoose_1.Schema.ObjectId, ref: 'User', default: null },
    description: { type: String, default: null },
    votes: { type: mongoose_1.Schema.ObjectId, ref: 'Vote', default: null },
    isShared: { type: Boolean, default: false },
    comments: { type: [mongoose_1.Schema.ObjectId], ref: 'Comment', default: [] },
    share: { type: [String], default: [] },
    post: { type: postSchema, required: true },
}, {
    timestamps: true,
});
// Create the model
const Post = (0, mongoose_1.model)('Post', postMainSchema);
exports.default = Post;
