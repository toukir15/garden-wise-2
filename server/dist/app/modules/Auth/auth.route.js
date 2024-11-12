"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const user_const_1 = require("../user/user.const");
const multer_config_1 = require("../../config/multer.config");
const bodyParser_1 = require("../../middlewares/bodyParser");
const router = express_1.default.Router();
router.post('/register', multer_config_1.multerUpload.single('file'), 
// validateRequest(AuthValidation.registerValidationSchema),
auth_controller_1.AuthControllers.registerUser);
router.post('/login', 
// validateRequest(AuthValidation.loginValidationSchema),
auth_controller_1.AuthControllers.loginUser);
router.patch('/change-password', (0, auth_1.default)(user_const_1.USER_ROLE.user, user_const_1.USER_ROLE.admin), 
// validateRequest(AuthValidation.changePasswordValidationSchema),
auth_controller_1.AuthControllers.changePassword);
router.post('/edit-profile', multer_config_1.multerUpload.single('profilePhoto'), (0, auth_1.default)(user_const_1.USER_ROLE.user, user_const_1.USER_ROLE.admin), bodyParser_1.parseBody, auth_controller_1.AuthControllers.editProfile);
router.post('/refresh-token', (0, validateRequest_1.validateRequestCookies)(auth_validation_1.AuthValidation.refreshTokenValidationSchema), auth_controller_1.AuthControllers.refreshToken);
exports.AuthRouter = router;
