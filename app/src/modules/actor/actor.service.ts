import { ActorRepository } from './actor.repository'
import { MovieAttributes } from './movie.model'

export class MovieService {
  private constructor(private readonly repo: ActorRepository) {}
  public static init() {
    return new MovieService(ActorRepository.init())
  }

  async create(movie: Omit<MovieAttributes, 'id' | 'createdAt' | 'updatedAt'>, actorNames: string[]) {
    return this.repo.create(movie, actorNames)
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