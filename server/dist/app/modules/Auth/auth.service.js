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
exports.AuthServices = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const verifyJWT_1 = require("../../utils/verifyJWT");
const user_const_1 = require("../user/user.const");
const connection_model_1 = require("../connection/connection.model");
const user_model_1 = require("../user/user.model");
const bookmark_model_1 = __importDefault(require("../bookmark/bookmark.model"));
const emailSender_1 = require("../../utils/emailSender");
const registerUser = (payload, profilePhoto) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email });
    if (user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is already exist!');
    }
    const createConnection = yield connection_model_1.Connection.create({});
    // make password hash
    const salt = bcryptjs_1.default.genSaltSync(Number(config_1.default.bcrypt_salt_rounds));
    const hash = bcryptjs_1.default.hashSync(payload.password, salt);
    // add role, profilePhoto and hash password
    payload.role = user_const_1.USER_ROLE.user;
    payload.profilePhoto = profilePhoto;
    payload.password = hash;
    payload.connection = createConnection === null || createConnection === void 0 ? void 0 : createConnection._id;
    payload.bookmark = null;
    //create new user
    const newUser = yield user_model_1.User.create(payload);
    // create bookmark collection
    const createBookmark = yield bookmark_model_1.default.create({ user: newUser._id });
    yield user_model_1.User.findByIdAndUpdate(newUser._id, { bookmark: createBookmark._id });
    //create token and sent to the  client
    const jwtPayload = {
        _id: newUser === null || newUser === void 0 ? void 0 : newUser._id.toString(),
        name: newUser === null || newUser === void 0 ? void 0 : newUser.name,
        email: newUser.email,
        role: newUser === null || newUser === void 0 ? void 0 : newUser.role,
        profilePhoto: newUser === null || newUser === void 0 ? void 0 : newUser.profilePhoto,
        isVerified: newUser === null || newUser === void 0 ? void 0 : newUser.isVerified,
    };
    const accessToken = (0, verifyJWT_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, verifyJWT_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found!');
    }
    const matchPassword = bcryptjs_1.default.compareSync(payload.password, user.password);
    //checking if the password is correct
    if (!matchPassword)
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Password do not matched');
    //create token and sent to the  client
    const jwtPayload = {
        _id: user === null || user === void 0 ? void 0 : user._id.toString(),
        name: user === null || user === void 0 ? void 0 : user.name,
        email: user.email,
        role: user === null || user === void 0 ? void 0 : user.role,
        profilePhoto: user === null || user === void 0 ? void 0 : user.profilePhoto,
        isVerified: user === null || user === void 0 ? void 0 : user.isVerified,
        bookmark: user === null || user === void 0 ? void 0 : user.bookmark,
    };
    const accessToken = (0, verifyJWT_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, verifyJWT_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const changePassword = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.findOne({ email: userData === null || userData === void 0 ? void 0 : userData.email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found!');
    }
    const matchPassword = bcryptjs_1.default.compareSync(payload.oldPassword, user.password);
    //checking if the password is correct
    if (!matchPassword) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Password do not matched');
    }
    //hash new password
    const newHashedPassword = yield bcryptjs_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    yield user_model_1.User.findOneAndUpdate({
        email: userData.email,
        role: userData === null || userData === void 0 ? void 0 : userData.role,
    }, {
        password: newHashedPassword,
        passwordChangedAt: new Date(),
    });
    return null;
});
const forgetPassword = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.findOne({ email: userData === null || userData === void 0 ? void 0 : userData.email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found!');
    }
    //hash new password
    const newHashedPassword = yield bcryptjs_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    yield user_model_1.User.findOneAndUpdate({
        email: userData.email,
        role: userData === null || userData === void 0 ? void 0 : userData.role,
    }, {
        password: newHashedPassword,
        passwordChangedAt: new Date(),
    });
    return null;
});
const sendForgetEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const findUser = yield user_model_1.User.findOne({ email: email });
    if (!findUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User does not exist!");
    }
    const jwtPayload = {
        _id: findUser === null || findUser === void 0 ? void 0 : findUser._id.toString(),
        name: findUser === null || findUser === void 0 ? void 0 : findUser.name,
        email: findUser.email,
        role: findUser === null || findUser === void 0 ? void 0 : findUser.role,
        profilePhoto: findUser === null || findUser === void 0 ? void 0 : findUser.profilePhoto,
        isVerified: findUser === null || findUser === void 0 ? void 0 : findUser.isVerified,
        bookmark: findUser === null || findUser === void 0 ? void 0 : findUser.bookmark,
    };
    const token = (0, verifyJWT_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    yield (0, emailSender_1.sendEmail)(findUser.email, token);
});
const editProfile = (payload, profilePhoto, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedData = {};
    if (payload.name) {
        updatedData.name = payload.name;
    }
    if (payload.address) {
        updatedData.address = payload.address;
    }
    if (profilePhoto === null || profilePhoto === void 0 ? void 0 : profilePhoto.path) {
        updatedData.profilePhoto = profilePhoto.path;
    }
    yield user_model_1.User.findByIdAndUpdate(userId, updatedData);
    const user = yield user_model_1.User.findById(userId);
    const jwtPayload = {
        _id: user === null || user === void 0 ? void 0 : user._id.toString(),
        name: user === null || user === void 0 ? void 0 : user.name,
        email: user.email,
        role: user === null || user === void 0 ? void 0 : user.role,
        profilePhoto: user === null || user === void 0 ? void 0 : user.profilePhoto,
        isVerified: user === null || user === void 0 ? void 0 : user.isVerified,
        bookmark: user === null || user === void 0 ? void 0 : user.bookmark,
    };
    const accessToken = (0, verifyJWT_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, verifyJWT_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const refreshToken = (email) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.findOne({ email: email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found!');
    }
    const jwtPayload = {
        _id: user === null || user === void 0 ? void 0 : user._id.toString(),
        name: user === null || user === void 0 ? void 0 : user.name,
        email: user.email,
        role: user === null || user === void 0 ? void 0 : user.role,
        profilePhoto: user === null || user === void 0 ? void 0 : user.profilePhoto,
        isVerified: user === null || user === void 0 ? void 0 : user.isVerified,
        bookmark: user === null || user === void 0 ? void 0 : user.bookmark,
    };
    const accessToken = (0, verifyJWT_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return {
        accessToken,
    };
});
exports.AuthServices = {
    registerUser,
    loginUser,
    changePassword,
    refreshToken,
    editProfile,
    sendForgetEmail,
    forgetPassword
};
