import { Request, Response, Router, NextFunction } from 'express'
import { MovieService } from './movie.service'
import { MovieAttributes, MovieSourceType } from 'shared/entities/movie'

export class MovieController {
  private constructor(private readonly service: MovieService) {}
  public static init() {
    return new MovieController(MovieService.init())
  }

  public create = async (req: Request, res: Response) => {
    try {
      const { title, year, format } = req.body as MovieAttributes
      const userId = req.user?.id!
  
      const movie = await this.service.create({
        title, year, format, source: { type: MovieSourceType.WEB},
        actors: []
      }, userId)
      res.status(201).json(movie)
    } catch (e: any) {
      res.status(400).json({ error: e.message })
    }
  }

  public getById = async (req: Request, res: Response) => {
    try {
      const movie = await this.service.getById(Number(req.params.id))
      if (!movie) return res.status(404).json({ error: 'Not found' })
      res.json(movie)
    } catch (e: any) {
      res.status(400).json({ error: e.message })
    }
  }

  public getAllSorted = async (_req: Request, res: Response) => {
    try {
      const movies = await this.service.getAllSorted()
      res.json(movies)
    } catch (e: any) {
      res.status(400).json({ error: e.message })
    }
  }

  public findByTitle = async (req: Request, res: Response) => {
    try {
      const { title } = req.query
      const movies = await this.service.findByTitle(String(title))
      res.json(movies)
    } catch (e: any) {
      res.status(400).json({ error: e.message })
    }
  }

  public findByActorName = async (req: Request, res: Response) => {
    try {
      const { name } = req.query
      const movies = await this.service.findByActorName(String(name))
      res.json(movies)
    } catch (e: any) {
      res.status(400).json({ error: e.message })
    }
  }

  public delete = async (req: Request, res: Response) => {
    try {
      await this.service.delete(Number(req.params.id))
      res.status(204).send()
    } catch (e: any) {
      res.status(400).json({ error: e.message })
    }
  }

  // Middleware: проверка, что пользователь владеет фильмом
  public static userOwnsMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id
      const movieId = Number(req.params.id)
      const movie = await MovieService.init().getById(movieId)
      if (!movie) return res.status(404).json({ error: 'Movie not found' })
      if (movie.userId !== userId) return res.status(403).json({ error: 'Forbidden: not your movie' })
      next()
    } catch (e: any) {
      res.status(400).json({ error: e.message })
    }
  }
}

const router = Router()
const controller = MovieController.init()

router.post('/', controller.create)
router.get('/', controller.getAllSorted)
router.get('/search/title', controller.findByTitle)
router.get('/search/actor', controller.findByActorName)
router.get('/:id', controller.getById)
router.delete('/:id', MovieController.userOwnsMovie, controller.delete)

export default router