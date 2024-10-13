"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.ProfileServices = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importStar(require("http-status"));
const user_model_1 = require("../user/user.model");
const updateMyProfile = (userId, data, profilePhoto) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = yield user_model_1.User.findById(userId);
    if (!profile) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User profile does not exixts!');
    }
    if (profilePhoto) {
        data.profilePhoto = profilePhoto;
    }
    else {
        delete data.profilePhoto;
    }
    return yield user_model_1.User.findByIdAndUpdate(userId, data, { new: true });
});
const myFollowings = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // check the user exist or not
    const findUser = yield user_model_1.User.findById(userId);
    if (!findUser) {
        throw new AppError_1.default(http_status_1.BAD_REQUEST, 'User does not exist!');
    }
    const result = yield user_model_1.User.findById(findUser === null || findUser === void 0 ? void 0 : findUser._id)
        .select({ connection: 1 })
        .populate({
        path: 'connection',
        select: { followings: 1 },
        populate: {
            path: 'followings',
            model: 'User',
            select: { _id: 1, name: 1, email: 1, profilePhoto: 1 },
        },
    });
    return result;
});
const myFollowers = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // check the user exist or not
    const findUser = yield user_model_1.User.findById(userId);
    if (!findUser) {
        throw new AppError_1.default(http_status_1.BAD_REQUEST, 'User does not exist!');
    }
    const result = yield user_model_1.User.findById(findUser === null || findUser === void 0 ? void 0 : findUser._id)
        .select({ connection: 1 })
        .populate({
        path: 'connection',
        select: { followers: 1 },
        populate: {
            path: 'followers',
            model: 'User',
            select: { _id: 1, name: 1, email: 1, profilePhoto: 1 },
        },
    });
    return result;
});
exports.ProfileServices = {
    updateMyProfile,
    myFollowings,
    myFollowers,
};
