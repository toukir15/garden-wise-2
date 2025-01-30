"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join((process.cwd(), '.env')) });
exports.default = {
    NODE_ENV: process.env.NODE_ENV,
    port: process.env.PORT,
    db_url: process.env.DB_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
    jwt_send_email_expires_in: process.env.JWT_SEND_EMAIL_EXPIRES_IN,
    admin_mobile_number: process.env.ADMIN_MOBILE_NUMBER,
    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
    client_url: process.env.CLIENT_URL,
    stripe_cli: process.env.STRIPE_CLI,
    stripe_endpoint_secret: process.env.STRIPE_ENDPOINT_SECRET,
    success_url: process.env.SUCCESS_URL,
    node_mailer: {
        sender_email: process.env.SENDER_EMAIL,
        sender_app_password: process.env.SENDER_APP_PASSWORD,
    },
};
