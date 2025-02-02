"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_const_1 = require("./user.const");
const router = express_1.default.Router();
router.post('/signup', user_controller_1.UserControllers.createUser);
router.get('/', (0, auth_1.default)(user_const_1.USER_ROLE.user, user_const_1.USER_ROLE.admin), user_controller_1.UserControllers.getUsers);
router.get('/follow-suggetion', (0, auth_1.default)(user_const_1.USER_ROLE.user, user_const_1.USER_ROLE.admin), user_controller_1.UserControllers.getFollowSuggetionUsers);
router.get('/:userId', (0, auth_1.default)(user_const_1.USER_ROLE.user, user_const_1.USER_ROLE.admin), user_controller_1.UserControllers.getUser);
// router.get('/:userId', UserControllers.getUsers)
router.post('/:id', user_controller_1.UserControllers.updateUser);
exports.UserRouter = router;
