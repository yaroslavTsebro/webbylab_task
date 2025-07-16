import { Router } from 'express'
import { MovieController } from './movie.controller'

const router = Router()
const controller = MovieController.init()

router.post('/', controller.create)
router.get('/', controller.getAllSorted)
router.get('/search/title', controller.findByTitle)
router.get('/search/actor', controller.findByActorName)
router.get('/:id', controller.getById)
router.delete('/:id', controller.delete)

export default router 