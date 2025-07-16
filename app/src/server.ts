import express from 'express'
import authRouter from '@/modules/auth'
import moviesRouter from '@/modules/movie'
import { AuthMiddleware } from '@/modules/auth/middleware'

const app = express()

app.use(express.json())
app.use('/auth', authRouter)
app.use('/movies', moviesRouter)

// Пример защищенного эндпоинта
app.get('/protected', AuthMiddleware.requireAuth, (req, res) => {
  res.json({ message: 'You are authorized', user: req.user })
})

export default app
