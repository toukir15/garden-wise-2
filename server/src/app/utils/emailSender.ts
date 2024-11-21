import nodemailer from 'nodemailer'
import config from '../config'

export const sendEmail = async (email: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: config.node_mailer.sender_email,
      pass: config.node_mailer.sender_app_password,
    },
  })

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object
    await transporter.sendMail({
      from: '"Garden-Wise" <toukir.developer.bd@gmail.email>', // sender address
      to: email, // list of receivers
      subject: 'Password Reset Request', // Subject line
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #4CAF50;">Garden-Wise Password Reset</h2>
          <p>Hello,</p>
          <p>You requested to reset your password. Please click the link below to reset it:</p>
          <a href="https://example.com/reset-password?email=${encodeURIComponent('toukir486@gmail.com')}" 
             style="display: inline-block; padding: 10px 15px; color: white; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
             Reset Password
          </a>
          <p>If you did not request this, please ignore this email.</p>
          <p>Thanks,<br>The Garden-Wise Team</p>
        </div>
      `,
    })
  }
  main()
}
