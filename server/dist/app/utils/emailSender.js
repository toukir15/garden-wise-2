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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const sendEmail = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: config_1.default.node_mailer.sender_email,
            pass: config_1.default.node_mailer.sender_app_password,
        },
    });
    // async..await is not allowed in global scope, must use a wrapper
    function main() {
        return __awaiter(this, void 0, void 0, function* () {
            // send mail with defined transport object
            yield transporter.sendMail({
                from: '"Garden-Wise" <toukir.developer.bd@gmail.email>', // sender address
                to: email, // list of receivers
                subject: 'Password Reset Request', // Subject line
                html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #4CAF50;">Garden-Wise Password Reset</h2>
          <p>Hello,</p>
          <p>You requested to reset your password. Please click the link below to reset it:</p>
          <a href="http://localhost:3000/forget-password?token=${encodeURIComponent(token)}" 
             style="display: inline-block; padding: 10px 15px; color: white; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
             Reset Password
          </a>
          <p>If you did not request this, please ignore this email.</p>
          <p>Thanks,<br>The Garden-Wise Team</p>
        </div>
      `,
            });
        });
    }
    main();
});
exports.sendEmail = sendEmail;
