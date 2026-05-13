"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
const mongoose_1 = require("mongoose");
const connectionSchema = new mongoose_1.Schema({
    followers: { type: [mongoose_1.Schema.ObjectId], default: [] },
    followings: { type: [mongoose_1.Schema.ObjectId], default: [] },
});
exports.Connection = (0, mongoose_1.model)('Connection', connectionSchema);
