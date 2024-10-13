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
exports.ConnectionController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = require("../../utils/catchAsync");
const connection_service_1 = require("./connection.service");
const updateFollowConnection = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const followUserId = req.params.followUserId;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const result = yield connection_service_1.ConnectionServices.updateFollowConnectionIntoDB(followUserId, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Update follow connection successfully!',
        data: result,
    });
}));
const updateUnfollowConnection = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const unfollowUserId = req.params.unfollowUserId;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
    const result = yield connection_service_1.ConnectionServices.updateUnfollowConnectionIntoDB(unfollowUserId, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Update unfollow connection successfully!',
        data: result,
    });
}));
exports.ConnectionController = {
    updateFollowConnection,
    updateUnfollowConnection,
};
