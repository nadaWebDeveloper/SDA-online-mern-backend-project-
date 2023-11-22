import express from 'express'
import mongoose from 'mongoose'
import { config } from 'dotenv'

import usersRouter from './routers/users'
import productsRouter from './routers/by SDA/products'
import ordersRouter from './routers/by SDA/orders'
import apiErrorHandler from './middlewares/errorHandler'
import myLogger from './middlewares/logger'

config()
const app = express()
const PORT = 5050
// const URL = process.env.ATLAS_URL as string
const URL = 'mongodb://127.0.0.1:27017/full-stack-demo-db'

app.use(myLogger)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/users', usersRouter)
// app.use('/api/orders', ordersRouter)
app.use('/api/products', productsRouter)

app.use(apiErrorHandler)

mongoose
  .connect(URL)
  .then(() => {
    console.log('Database connected')
  })
  .catch((err) => {
    console.log('MongoDB connection error, ', err)
  })

app.listen(PORT, () => {
  console.log('Server running http://localhost:' + PORT)
})
