import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import { fileURLToPath } from 'url'
import loggerConfig from '../config/logger.mjs'
import cors from 'cors'
import sessionConfig from '../config/session.mjs'
import auth from './auth.mjs'

// Визначення поточного файлу і директорії
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const middleware = (app) => {
  // Middleware для підтримки CORS (Cross-Origin Resource Sharing)
  app.use(cors())

  // Middleware для аутентифікації та авторизації
  auth(app)

  // Middleware для логування запитів
  app.use(loggerConfig)

  // Middleware для парсингу JSON запитів
  app.use(express.json())

  // Middleware для парсингу URL-кодованих даних
  app.use(express.urlencoded({ extended: false }))

  // Middleware для парсингу cookies
  app.use(cookieParser())

  // Middleware для обробки статичних файлів з директорії public
  app.use(express.static(path.join(__dirname, '../public')))

  // Middleware для обробки статичних файлів з директорії uploads
  app.use(express.static(path.join(__dirname, '../uploads')))

  // Middleware для налаштування сесій
  app.use(sessionConfig)
}

export default middleware
