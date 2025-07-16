import { Router } from 'express'
import { MovieController } from './movie.controller'
import { AuthMiddleware } from '../auth/auth.middleware'
import { UserOwnsMovieMiddleware } from './movie.middleware'

const router = Router()
const controller = MovieController.init()

const authMiddleware = AuthMiddleware.requireAuth
const userOwnsMovie = [AuthMiddleware.requireAuth, UserOwnsMovieMiddleware.userOwnsMovie]

router.post('/', authMiddleware, controller.create)
router.get('/', authMiddleware, controller.getAllSorted)
router.get('/search/title', authMiddleware, controller.findByTitle)
router.get('/search/actor', authMiddleware, controller.findByActorName)
router.get('/:id', authMiddleware, controller.getById)
router.delete('/:id', userOwnsMovie, controller.delete)

export default router 