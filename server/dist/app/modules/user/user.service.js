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
exports.UserServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("./user.model");
const config_1 = __importDefault(require("../../config"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const connection_model_1 = require("../connection/connection.model");
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check user is exist or not
    const isUserExist = yield user_model_1.User.findOne({ email: payload.email });
    if (isUserExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is already exist');
    }
    // make password hash
    const salt = bcryptjs_1.default.genSaltSync(Number(config_1.default.bcrypt_salt_rounds));
    const hash = bcryptjs_1.default.hashSync(payload.password, salt);
    if (!hash) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'Conflict with user credantial');
    }
    payload.password = hash;
    const result = yield user_model_1.User.create(payload);
    return result;
});
const getFollowSuggetionUsersFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the user by ID
    const findUser = yield user_model_1.User.findById(userId);
    if (!findUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User not found');
    }
    // Find the connection by ID
    const findConnection = yield connection_model_1.Connection.findById(findUser.connection);
    if (!findConnection) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Connection not found');
    }
    // Ensure followers and followings are arrays to avoid undefined values
    const followings = findConnection.followings || [];
    // Fetch users that are NOT in the followers and followings arrays
    const usersNotConnected = yield user_model_1.User.find({
        _id: { $nin: [...followings, userId] },
    });
    // Return the result
    return usersNotConnected;
});
const getUserFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the user by ID
    const findUser = yield user_model_1.User.findById(userId);
    if (!findUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User not found');
    }
    const result = yield user_model_1.User.findById(userId);
    return result;
});
const updateUserIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndUpdate(id, { role: 'admin' }, { new: true });
    return result;
});
exports.UserServices = {
    createUserIntoDB,
    getFollowSuggetionUsersFromDB,
    updateUserIntoDB,
    getUserFromDB,
};
