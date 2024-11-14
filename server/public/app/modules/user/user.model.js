"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: 1, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    profilePhoto: {
        type: String,
        default: 'https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg',
    },
    address: { type: String },
    connection: { type: mongoose_1.Schema.ObjectId, default: null, ref: 'Connection' },
    isVerified: { type: Boolean, default: false },
}, { timestamps: true });
// Use models.User to check if the User model exists, and only define it if it doesn't
exports.User = mongoose_1.models.User || (0, mongoose_1.model)('User', userSchema);
