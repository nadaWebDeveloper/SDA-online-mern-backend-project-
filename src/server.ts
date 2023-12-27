import express, { Application, Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import { config } from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import authRouter from './routers/authRouter'
import usersRouter from './routers/usersRouter'
import ordersRouter from './routers/ordersRouter'
import productsRouter from './routers/productRouter'
import categoriesRouter from './routers/categoriesRouter'

import { dev } from './config'
import ApiError from './errors/ApiError'
import myLogger from './middlewares/logger'
import apiErrorHandler from './middlewares/errorHandler'

config()
const app: Application = express()
const PORT = dev.app.port

mongoose.set('strictQuery', false)
mongoose.set('strictPopulate', false)
const URL = String(dev.db.url)

app.use(myLogger)
app.use(cookieParser())
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}))
app.use(express.urlencoded({ extended: true }))
app.use('/public',express.static('public'))


app.use('/products', productsRouter)
app.use('/categories', categoriesRouter)
app.use('/orders', ordersRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)

app.get('/', (request: Request, response: Response) => {
  response.json({
    message: 'CheckUp The Server',
  })
})

app.use((request: Request, response: Response, next: NextFunction) => {
  next(ApiError.badRequest(404, `Router not Found`))
})

app.use(apiErrorHandler)

mongoose
  .connect(URL)
  .then(() => {
    console.log('Database connected')
  })
  .catch((error) => {
    console.log(`MongoDB connection error: ${error}`)
  })

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
