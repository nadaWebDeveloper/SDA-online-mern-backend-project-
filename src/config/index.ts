import 'dotenv/config'
export const dev = {
  app: {
    port: process.env.SERVER_PORT || 5050,
    jwtUserActivationKey: process.env.JWT_USER_ACTIVATION_KEY || 'dfjkldjglkjdljl',
    jwtAccessKey: process.env.JWT_ACCESS_KEY || 'jhjhkhjhk',
    smtpUserName: process.env.SMTP_USERNAME || 'nadayahya.almalki@integrify.io',
    smtpPassword: process.env.SMTP_PASSWORD || 'vesf vjdg ncwm goky',
    jwtResetKey: process.env.JWT_RESET_KEY || 'jgkynlesesf',
  },
  db: {
    url: process.env.MONGO_URL || 'mongodb+srv://nadaYahya:Almalki123@cluster0.tvnc3qb.mongodb.net/full-StackDB?retryWrites=true&w=majority',
  },
}
