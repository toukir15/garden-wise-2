"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.ObjectId, ref: 'User', default: null },
    amount: { type: String, default: null },
}, {
    timestamps: true,
});
// Create the model
exports.Payment = (0, mongoose_1.model)('Payment', paymentSchema);
