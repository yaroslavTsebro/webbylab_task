import { Actor } from '@/system/db/db'

export class ActorService {
  private constructor() {}
  public static init() {
    return new ActorService()
  }

  async create(name: string) {
    return Actor.create({ name })
  }

  async findById(id: number) {
    return Actor.findByPk(id)
  }

  async findByName(name: string) {
    return Actor.findOne({ where: { name } })
  }

  async findAll() {
    return Actor.findAll()
  }

  async delete(id: number) {
    return Actor.destroy({ where: { id } })
  }
} 