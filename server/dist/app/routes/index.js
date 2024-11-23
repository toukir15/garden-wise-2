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
const dashboard_route_1 = require("../modules/dashboard/dashboard.route");
const comment_route_1 = require("../modules/comment/comment.route");
const bookmark_route_1 = require("../modules/bookmark/bookmark.route");
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
        route: dashboard_route_1.DashboardRoute,
    },
    {
        path: '/posts',
        route: post_route_1.PostRouter,
    },
    {
        path: '/comments',
        route: comment_route_1.CommentRouter,
    },
    {
        path: '/connections',
        route: connection_route_1.ConnectionRouter,
    },
    {
        path: '/payments',
        route: payment_route_1.PaymentRouter,
    },
    {
        path: '/bookmarks',
        route: bookmark_route_1.BookmarkRouter,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
