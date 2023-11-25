import 'dotenv/config'
export const dev = {
  app: {
    port: process.env.SERVER_PORT || 5050,
    jwsUserActivationKey: process.env.JWT_USER_ACTIVATION_KEY || 'dfjkldjglkjdljl',
  },
  db: {
    url: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/full-stack-demo-db',
  },
}
