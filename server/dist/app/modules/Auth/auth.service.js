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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const verifyJWT_1 = require("../../utils/verifyJWT");
const user_const_1 = require("../user/user.const");
const connection_model_1 = require("../connection/connection.model");
const user_model_1 = require("../user/user.model");
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
    //create new user
    const newUser = yield user_model_1.User.create(payload);
    //create token and sent to the  client
    const jwtPayload = {
        _id: newUser === null || newUser === void 0 ? void 0 : newUser._id.toString(),
        name: newUser === null || newUser === void 0 ? void 0 : newUser.name,
        email: newUser.email,
        role: newUser === null || newUser === void 0 ? void 0 : newUser.role,
        profilePhote: newUser.profilePhoto,
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
    const matchPassword = bcryptjs_1.default.compareSync(userData.password, user.password);
    //checking if the password is correct
    if (!matchPassword)
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Password do not matched');
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
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the given token is valid
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_refresh_secret);
    const { email, iat } = decoded;
    // checking if the user is exist
    const user = yield user_model_1.User.findOne({ email: email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found!');
    }
    // if (
    //   user.passwordChangedAt &&
    //   User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
    // ) {
    //   throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !')
    // }
    const jwtPayload = {
        _id: user === null || user === void 0 ? void 0 : user._id.toString(),
        name: user === null || user === void 0 ? void 0 : user.name,
        email: user.email,
        role: user === null || user === void 0 ? void 0 : user.role,
        profilePhoto: user.profilePhoto,
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
};
