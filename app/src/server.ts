import 'reflect-metadata'
import express from 'express'
import authRouter from './modules/auth'
import moviesRouter from './modules/movie'
import cors from 'cors';

const app = express()

app.use(cors({ origin: '*' }));

app.use(express.json())

app.use('/auth', authRouter)
app.use('/movies', moviesRouter)

export default app
