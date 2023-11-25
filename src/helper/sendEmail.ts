import nodemailer from 'nodemailer'
import { dev } from '../config'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: dev.app.smtpUserName,
    pass: dev.app.smtpPassword,
  },
})
type EmailDataType = {
  email: string
  subject: string
  html: string
}
export const sendEmail = async (emailData: EmailDataType) => {
  try {
    console.log('user', dev.app.smtpUserName)
    console.log('password', dev.app.smtpPassword)
    const mailOptions = {
      from: dev.app.smtpUserName,
      to: emailData.email,
      subject: emailData.subject,
      html: emailData.html,
    }
    console.log('user from  mailoptoion', mailOptions.from)
    console.log('to from  mailoptoion', mailOptions.to)

    const info = await transporter.sendMail(mailOptions)
    console.log('message was sent', info.response)
  } catch (error) {
    console.log('error with email', error)
    throw error
  }
}
