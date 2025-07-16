import { Router } from 'express'
import { MovieController } from './movie.controller'
import { AuthMiddleware } from '../auth/auth.middleware'
import { UserOwnsMovieMiddleware } from './movie.middleware'
import { uploadMoviesFile } from '../../system/upload/multer'

const router = Router()
const controller = MovieController.init()

const authMiddleware = AuthMiddleware.requireAuth
const userOwnsMovie = [AuthMiddleware.requireAuth, UserOwnsMovieMiddleware.userOwnsMovie]

router.post('/', authMiddleware, controller.create)
router.get('/', authMiddleware, controller.getAllSorted)
router.get('/:id', authMiddleware, controller.getById)
router.post('/upload', authMiddleware, uploadMoviesFile.single('file'), controller.uploadFromFile)
router.delete('/:id', userOwnsMovie, controller.delete)

export default router 