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
exports.ConnectionServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../user/user.model");
const connection_model_1 = require("./connection.model");
const updateFollowConnectionIntoDB = (followUserId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    //check find user exist or not
    const currentUser = yield user_model_1.User.findById(userId);
    if (!currentUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User does not exist!');
    }
    //check following user exist or not
    const followUser = yield user_model_1.User.findById(followUserId);
    if (!followUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User does not exist!');
    }
    //check already follow or not
    const currentUserConnection = yield connection_model_1.Connection.findOne({
        _id: currentUser.connection,
        followings: { $in: [followUser === null || followUser === void 0 ? void 0 : followUser._id] },
    });
    const followUserConnection = yield connection_model_1.Connection.findOne({
        _id: followUser.connection,
        followers: { $in: [currentUser === null || currentUser === void 0 ? void 0 : currentUser._id] },
    });
    if (currentUserConnection || followUserConnection) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'You already follow this user');
    }
    // update following user connection
    yield connection_model_1.Connection.findByIdAndUpdate(followUser.connection, {
        $push: { followers: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id },
    });
    // update follow user connection
    yield connection_model_1.Connection.findByIdAndUpdate(currentUser.connection, {
        $push: { followings: followUser === null || followUser === void 0 ? void 0 : followUser._id },
    });
});
const updateUnfollowConnectionIntoDB = (unfollowUserId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    //check find user exist or not
    const currentUser = yield user_model_1.User.findById(userId);
    if (!currentUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User does not exist!');
    }
    //check following user exist or not
    const unfollowUser = yield user_model_1.User.findById(unfollowUserId);
    if (!unfollowUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User does not exist!');
    }
    //check already follow or not
    const currentUserConnection = yield connection_model_1.Connection.findOne({
        _id: currentUser.connection,
        followings: { $in: [unfollowUser === null || unfollowUser === void 0 ? void 0 : unfollowUser._id] },
    });
    const unfollowUserConnection = yield connection_model_1.Connection.findOne({
        _id: unfollowUser.connection,
        followers: { $in: [currentUser === null || currentUser === void 0 ? void 0 : currentUser._id] },
    });
    if (currentUserConnection || unfollowUserConnection) {
        // update following user connection
        yield connection_model_1.Connection.findByIdAndUpdate(unfollowUser.connection, {
            $pull: { followers: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id },
        });
        // update follow user connection
        yield connection_model_1.Connection.findByIdAndUpdate(currentUser.connection, {
            $pull: { followings: unfollowUser === null || unfollowUser === void 0 ? void 0 : unfollowUser._id },
        });
    }
    else {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'You already unfollow this user');
    }
});
exports.ConnectionServices = {
    updateFollowConnectionIntoDB,
    updateUnfollowConnectionIntoDB,
};
