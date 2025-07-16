import { Request, Response, NextFunction } from 'express'
import { MovieService } from './movie.service'

export class UserOwnsMovieMiddleware {
  static async userOwnsMovie(req: Request, res: Response, next: NextFunction) {
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