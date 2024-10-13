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
        default: 'https://drive.google.com/file/d/1fyV7dYxPaXT9vDfhXpc_tKwYMIMdmVZD/view?usp=sharing',
    },
    address: { type: String },
    connection: { type: mongoose_1.Schema.ObjectId, default: null, ref: 'Connection' },
}, { timestamps: true });
// Use models.User to check if the User model exists, and only define it if it doesn't
exports.User = mongoose_1.models.User || (0, mongoose_1.model)('User', userSchema);
