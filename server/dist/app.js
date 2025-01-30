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
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const routes_1 = __importDefault(require("./app/routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = __importDefault(require("./app/config"));
const body_parser_1 = __importDefault(require("body-parser"));
const stripe_1 = __importDefault(require("stripe"));
const AppError_1 = __importDefault(require("./app/errors/AppError"));
const user_model_1 = require("./app/modules/user/user.model");
const payment_model_1 = require("./app/modules/payment/payment.model");
const stripe = new stripe_1.default(config_1.default.stripe_cli);
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [config_1.default.client_url],
    credentials: true,
}));
app.options('*', (0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
// Parser
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/v1', express_1.default.json(), routes_1.default);
// Testing route
app.get('/', (req, res, next) => {
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Welcome to the GardenWise API',
    });
});
app.post('/webhook', body_parser_1.default.raw({ type: 'application/json' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, config_1.default.stripe_endpoint_secret);
    }
    catch (err) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Webhook Error');
    }
    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata.user;
        try {
            // update slot status
            yield user_model_1.User.findByIdAndUpdate(userId, {
                isVerified: true,
            });
            yield payment_model_1.Payment.create({ user: userId, amount: '5.00' });
        }
        catch (err) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, err.message);
        }
    }
    else {
        console.log(`Unhandled event type ${event.type}`);
    }
    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
}));
// Global error handler
app.use(globalErrorHandler_1.default);
// Handle unmatched routes (404)
// app.use('*', notFound)
exports.default = app;
