import { CreateMovieDto, MovieRepository } from './movie.repository'

export class MovieService {

  private constructor(private readonly repo: MovieRepository) { }

  public static init() {
    return new MovieService(MovieRepository.init())
  }

  async create(movie: CreateMovieDto, userId: number) {
    return this.repo.create(movie, userId)
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