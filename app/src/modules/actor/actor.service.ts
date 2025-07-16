import { ActorRepository, CreateActorDto } from './actor.repository'

export class MovieService {
  private constructor(private readonly repo: ActorRepository) { }
  public static init() {
    return new MovieService(ActorRepository.init())
  }

  async create(actor: CreateActorDto) {
    return this.repo.create(actor)
  }

  async getByIds(ids: number[]) {
    return this.repo.getByIds(ids)
  }
} 