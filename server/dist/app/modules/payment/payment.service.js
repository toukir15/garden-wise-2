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
exports.PaymentService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../user/user.model");
const stripe = new stripe_1.default(config_1.default.stripe_cli);
const createPaymentSession = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const findUser = yield user_model_1.User.findById(userId);
    if (!findUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User does not exist');
    }
    // // Step 1: Create a Product
    const product = yield stripe.products.create({
        name: `${findUser.name}, verify your profile to unlock exclusive premium content!`,
        description: `Hi ${findUser.name}, it's time to verify your profile and gain access to a world of premium content! 
Unlock exclusive features, enjoy personalized experiences, and never miss out on our top-tier offerings. 
Verify now to take advantage of all the benefits waiting for you!`,
    });
    // // Step 2: Create a Price
    const price = yield stripe.prices.create({
        unit_amount: 500,
        currency: 'usd',
        product: product.id,
    });
    // // Step 3: Create a Checkout Session
    const session = yield stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [
            {
                price: price.id,
                quantity: 1,
            },
        ],
        customer_email: findUser.email,
        metadata: {
            user: String(findUser._id),
        },
        success_url: `${config_1.default.success_url}`,
        cancel_url: config_1.default.client_url,
    });
    return session;
});
exports.PaymentService = {
    createPaymentSession,
};
