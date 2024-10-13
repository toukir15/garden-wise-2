"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const util_1 = require("util");
const ReadFile = (0, util_1.promisify)(fs.readFile);
// const sendEmail = async (email: string, html: string, subject: string) => {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false, // Use `true` for port 465, `false` for all other ports
//     auth: {
//       user: config.sender_email,
//       pass: config.sender_app_password,
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   });
//   await transporter.sendMail({
//     from: '"FoundX" <fahimfiroz.ph@gmail.com>', // sender address
//     to: email, // list of receivers
//     subject, // Subject line.
//     //text: "Hello world?", // plain text body
//     html, // html body
//   });
// };
// const createEmailContent = async (data: object, templateType: string) => {
//   try {
//     const templatePath = path.join(
//       process.cwd(),
//       `src/views/${templateType}.template.hbs`
//     );
//     const content = await ReadFile(templatePath, 'utf8');
//     const template = Handlebars.compile(content);
//     return template(data);
//   } catch (error) {
//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       (error as Error).message
//     );
//   }
// };
// export const EmailHelper = {
//   sendEmail,
//   createEmailContent,
// };
