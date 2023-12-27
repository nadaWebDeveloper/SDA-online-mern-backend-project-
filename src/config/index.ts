import 'dotenv/config'
export const dev = {
  app: {
    port: process.env.SERVER_PORT || 5050,
    jwtUserActivationKey: process.env.JWT_USER_ACTIVATION_KEY ,
    jwtAccessKey: process.env.JWT_ACCESS_KEY ,
    smtpUserName: process.env.SMTP_USERNAME ,
    smtpPassword: process.env.SMTP_PASSWORD,
    jwtResetKey: process.env.JWT_RESET_KEY ,
  },
  db: {
    url: process.env.MONGO_URL ,
  },
  cloudinary: {
    cloudinaryName: process.env.CLOUDINARY_NAME ,
    cloudinaryAPIKey: process.env.CLOUDINARY_API_KEY ,
    cloudinaryAPISecretKey: process.env.CLOUDINARY_API_SECRET_KEY ,
  },
}
