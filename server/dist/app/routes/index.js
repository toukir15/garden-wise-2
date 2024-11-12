"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_route_1 = require("../modules/posts/post.route");
const connection_route_1 = require("../modules/connection/connection.route");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/Auth/auth.route");
const payment_route_1 = require("../modules/payment/payment.route");
const admin_route_1 = require("../modules/admin/admin.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.AuthRouter,
    },
    {
        path: '/users',
        route: user_route_1.UserRouter,
    },
    {
        path: '/admin',
        route: admin_route_1.AdminRouter,
    },
    {
        path: '/posts',
        route: post_route_1.PostRouter,
    },
    {
        path: '/connections',
        route: connection_route_1.ConnectionRouter,
    },
    {
        path: '/payments',
        route: payment_route_1.PaymentRouter,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
