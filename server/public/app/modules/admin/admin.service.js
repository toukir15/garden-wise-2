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
exports.AdminService = void 0;
const payment_model_1 = require("../payment/payment.model");
const post_model_1 = __importDefault(require("../posts/post.model"));
const user_model_1 = require("../user/user.model");
const getUserActivityFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield post_model_1.default.find()
        .select('sharedUser votes isShared comments share post createdAt')
        .populate([
        { path: 'votes', select: 'upvote downvote' },
        { path: 'comments', select: 'user' },
        { path: 'post.votes', select: 'upvote downvote' },
        { path: 'post.comments', select: 'text user votes replies createdAt' },
    ]);
    // Initialize an object to store monthly data
    const monthlyData = {};
    posts.forEach((post) => {
        var _a, _b, _c, _d, _e;
        const monthYear = new Date(post.createdAt).toLocaleString('default', {
            month: 'short',
            year: 'numeric',
        });
        // Initialize entry if not present
        if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = {
                name: monthYear,
                upvotes: 0,
                downvotes: 0,
                posts: 0,
                comments: 0,
            };
        }
        // Aggregate data for upvotes, downvotes, and comments
        const { upvote = [], downvote = [] } = post.votes || {};
        const postVotes = ((_a = post.post) === null || _a === void 0 ? void 0 : _a.votes) || {};
        const postComments = ((_b = post.post) === null || _b === void 0 ? void 0 : _b.comments) || [];
        monthlyData[monthYear].upvotes +=
            upvote.length + (((_c = postVotes.upvote) === null || _c === void 0 ? void 0 : _c.length) || 0);
        monthlyData[monthYear].downvotes +=
            downvote.length + (((_d = postVotes.downvote) === null || _d === void 0 ? void 0 : _d.length) || 0);
        monthlyData[monthYear].posts += 1;
        monthlyData[monthYear].comments +=
            (((_e = post.comments) === null || _e === void 0 ? void 0 : _e.length) || 0) + postComments.length;
    });
    // Convert object to array and sort by month
    return Object.values(monthlyData).sort((a, b) => new Date(`1 ${a.name}`).getTime() - new Date(`1 ${b.name}`).getTime());
});
const getMonthlyPaymentsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch payment data from the database
    const payments = yield payment_model_1.Payment.find();
    // Initialize an object to store monthly payment totals
    const monthlyTotals = {};
    payments.forEach((payment) => {
        // Extract month and year from the createdAt field
        const monthYear = new Date(payment.createdAt).toLocaleString('default', {
            month: 'short',
        });
        // Initialize the month in the object if not present
        if (!monthlyTotals[monthYear]) {
            monthlyTotals[monthYear] = 0;
        }
        // Add the payment amount to the corresponding month
        monthlyTotals[monthYear] += parseFloat(payment.amount);
    });
    // Convert the monthly totals object to an array in the desired format
    const monthOrder = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    const monthlyPaymentsData = monthOrder.map(month => ({
        name: month,
        payments: monthlyTotals[month] || 0, // If a month has no data, set payments to 0
    }));
    return monthlyPaymentsData;
});
const getPaymentsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_model_1.Payment.find().populate([
        { path: 'user', select: 'name email isVerified' },
    ]);
    return result;
});
const getPostsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.find()
        .select('sharedUser votes isShared comments share post createdAt')
        .populate([
        { path: 'votes', select: 'upvote downvote' },
        { path: 'sharedUser', select: 'name email' },
        { path: 'comments', select: 'user' },
        { path: 'post.votes', select: 'upvote downvote' },
        { path: 'post.user', select: 'name email' },
        { path: 'post.comments', select: 'text user votes replies createdAt' },
    ]);
    const posts = result.map((post) => ({
        _id: post._id,
        userName: post.isShared && post.sharedUser ? post.sharedUser.name : post.post.user.name,
        email: post.isShared && post.sharedUser ? post.sharedUser.email : post.post.user.email,
        upvotes: post.isShared ? post.votes.upvote.length : post.post.votes.upvote.length,
        downvotes: post.isShared ? post.votes.downvote.length : post.post.votes.downvote.length,
        comments: post.isShared ? post.comments.length : post.post.comments.length,
        isShared: post.isShared,
    }));
    return posts;
});
const getUsersFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.find({ _id: { $ne: userId } });
    return result;
});
const deleteUserFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndDelete(userId);
    console.log(result);
    return result;
});
const updateUserIntoDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(userId);
    const result = yield user_model_1.User.findByIdAndUpdate(userId, { role: 'admin' }, { new: true });
    return result;
});
exports.AdminService = {
    getUserActivityFromDB,
    getMonthlyPaymentsFromDB,
    getUsersFromDB,
    deleteUserFromDB,
    updateUserIntoDB,
    getPaymentsFromDB,
    getPostsFromDB,
};
