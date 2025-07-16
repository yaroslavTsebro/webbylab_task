import { Request, Response, NextFunction } from 'express'
import { MovieService } from './movie.service'
import { CreateMovieAttributes, MovieSourceType } from '../../shared/entities/movie'
import { getErrorMessage } from '../../shared/utils/get-error-message'

export class MovieController {
  private constructor(private readonly service: MovieService) { }

  public static init() {
    return new MovieController(MovieService.init())
  }

  public create = async (req: Request, res: Response) => {
    try {
      const { title, year, format, actors } = req.body as CreateMovieAttributes
      const userId = req.user?.id!

      const movie = await this.service.create({
        title, year, format, source: { type: MovieSourceType.WEB },
        actors: actors
      }, userId)
      res.status(201).json(movie)
    } catch (e: any) {
      console.dir(e)
      res.status(400).json({ error: getErrorMessage(e) })
    }
  }

  public getById = async (req: Request, res: Response) => {
    try {
      const movie = await this.service.getById(Number(req.params.id))
      if (!movie) return res.status(404).json({ error: 'Not found' })
      res.json(movie)
    } catch (e: any) {
      res.status(400).json({ error: getErrorMessage(e) })
    }
  }

  public uploadFromFile = async (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ error: 'File is required' })

    try {
      await this.service.importFromBuffer(req.file, req.user.id)
      return res.status(200).json({ success: true })
    } catch (e) {
      return res.status(500).json({ error: 'Failed to import movies', details: e })
    }
  }

  public getAllSorted = async (req: Request, res: Response) => {
    try {
      const { title, actor } = req.query as { title?: string; actor?: string }

      const movies = await this.service.searchMovies({
        title: title?.trim(),
        actor: actor?.trim(),
        fallbackAll: true
      })

      res.json(movies)
    } catch (e: any) {
      res.status(400).json({ error: getErrorMessage(e) })
    }
  }

  public delete = async (req: Request, res: Response) => {
    try {
      await this.service.delete(Number(req.params.id))
      res.status(204).send()
    } catch (e: any) {
      res.status(400).json({ error: getErrorMessage(e) })
    }
  }

  public static userOwnsMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id
      const movieId = Number(req.params.id)
      const movie = await MovieService.init().getById(movieId)
      if (!movie) return res.status(404).json({ error: 'Movie not found' })
      if (movie.userId !== userId) return res.status(403).json({ error: 'Forbidden: not your movie' })
      next()
    } catch (e: any) {
      res.status(400).json({ error: getErrorMessage(e) })
    }
  }
}