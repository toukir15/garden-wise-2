"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    const body = {
        success: data.success,
        message: data.message,
        data: data.data,
    };
    if (data.meta)
        body.meta = data.meta;
    res.status(data === null || data === void 0 ? void 0 : data.statusCode).json(body);
};
exports.default = sendResponse;
