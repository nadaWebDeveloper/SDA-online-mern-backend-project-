import 'dotenv/config'
export const dev = {
  app: {
    port: process.env.SERVER_PORT || 5050,
    jwtUserActivationKey: process.env.JWT_USER_ACTIVATION_KEY || 'dfjkldjglkjdljl',
    jwtAccessKey: process.env.JWT_ACCESS_KEY || 'jhjhkhjhk',
    smtpUserName: process.env.SMTP_USERNAME || 'wejdanabdulaziz.alghamdi@integrify.io',
    smtpPassword: process.env.SMTP_PASSWORD || 'vesf vjdg ncwm goky',
    jwtResetKey: process.env.JWT_RESET_KEY || 'jgkynlesesf',
  },
  db: {
    url: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/full-stack-demo-db',
  },
}
