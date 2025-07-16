import { Movie } from '@/shared/contracts/entities/movie'
import { MovieFactory, MovieFactoryData } from './movie.factory'
import { MovieRepository } from './movie.repository'

export class MovieService {

  private constructor(private readonly repo: MovieRepository) { }

  public static init() {
    return new MovieService(MovieRepository.init())
  }

  async create(movie: MovieFactoryData) {
    const raw = MovieFactory.build(movie)

    return new Movie(raw)
  }

  async getById(id: number) {
    return this.repo.findById(id)
  }

  async getAllSorted() {
    return this.repo.findAllSorted()
  }

  async findByTitle(title: string) {
    return this.repo.findByTitle(title)
  }

  async findByActorName(name: string) {
    return this.repo.findByActorName(name)
  }

  async delete(id: number) {
    return this.repo.delete(id)
  }
} 