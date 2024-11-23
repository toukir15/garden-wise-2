"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRoute = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_const_1 = require("../user/user.const");
const dashboard_controller_1 = require("./dashboard.controller");
const router = express_1.default.Router();
router.get('/user-activity', (0, auth_1.default)(user_const_1.USER_ROLE.user, user_const_1.USER_ROLE.admin), dashboard_controller_1.AdminController.getUserActivity);
router.get('/monthly-payments', (0, auth_1.default)(user_const_1.USER_ROLE.user, user_const_1.USER_ROLE.admin), dashboard_controller_1.AdminController.getMonthlyPayments);
router.get('/payments', (0, auth_1.default)(user_const_1.USER_ROLE.user, user_const_1.USER_ROLE.admin), dashboard_controller_1.AdminController.getPayments);
router.get('/posts', (0, auth_1.default)(user_const_1.USER_ROLE.user, user_const_1.USER_ROLE.admin), dashboard_controller_1.AdminController.getPosts);
router.get('/users', (0, auth_1.default)(user_const_1.USER_ROLE.user, user_const_1.USER_ROLE.admin), dashboard_controller_1.AdminController.getUsers);
router.delete('/:userId', (0, auth_1.default)(user_const_1.USER_ROLE.user, user_const_1.USER_ROLE.admin), dashboard_controller_1.AdminController.deleteUser);
router.patch('/:userId', (0, auth_1.default)(user_const_1.USER_ROLE.user, user_const_1.USER_ROLE.admin), dashboard_controller_1.AdminController.updateUser);
exports.DashboardRoute = router;
