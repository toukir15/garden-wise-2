"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the main post schema
const bookmarkSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.ObjectId, ref: 'User', default: null },
    posts: { type: [mongoose_1.Schema.ObjectId], default: [], ref: "Post" },
}, {
    timestamps: true,
});
// Create the model
const Bookmark = (0, mongoose_1.model)('Bookmark', bookmarkSchema);
exports.default = Bookmark;
