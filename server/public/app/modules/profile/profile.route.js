"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const multer_config_1 = require("../../config/multer.config");
const bodyParser_1 = require("../../middlewares/bodyParser");
const user_const_1 = require("../user/user.const");
const profile_controller_1 = require("./profile.controller");
const router = express_1.default.Router();
router.patch('/', (0, auth_1.default)(user_const_1.USER_ROLE.admin, user_const_1.USER_ROLE.user), multer_config_1.multerUpload.single('profilePhoto'), bodyParser_1.parseBody, profile_controller_1.ProfileController.updateMyProfile);
router.get('/my-followers', (0, auth_1.default)(user_const_1.USER_ROLE.admin, user_const_1.USER_ROLE.user), profile_controller_1.ProfileController.myFollowers);
router.get('/my-followings', (0, auth_1.default)(user_const_1.USER_ROLE.admin, user_const_1.USER_ROLE.user), profile_controller_1.ProfileController.myFollowings);
exports.ProfileRouter = router;
