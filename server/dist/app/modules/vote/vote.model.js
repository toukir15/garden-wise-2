"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vote = void 0;
const mongoose_1 = require("mongoose");
const voteSchema = new mongoose_1.Schema({
    upvote: { type: [String], default: [] },
    downvote: { type: [String], default: [] },
});
exports.Vote = (0, mongoose_1.model)('Vote', voteSchema);
