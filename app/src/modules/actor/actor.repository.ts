import { ActorInstance, CreateActorAttributes } from '../../shared/entities/actor'
import { Actor } from '../../system/db/db'
import { ModelStatic, Op, Transaction } from 'sequelize'

export class CreateActorDto {
  name!: string;
}

export class ActorRepository {
  private constructor(protected readonly model: ModelStatic<ActorInstance>) { }

  public static init(): ActorRepository {
    return new ActorRepository(Actor)
  }

  async getByIds(ids: number[]): Promise<ActorInstance[]> {
    return this.model.findAll({
      where: { id: { [Op.in]: ids } }
    })
  }

  async getOrCreateBatch(actors: CreateActorAttributes[], transaction: Transaction): Promise<ActorInstance[]> {
    const existingIds = actors.map(a => a.id)
    const newActors = actors.map(a => ({ name: a.name }))

    const found = await this.model.findAll({
      where: { id: { [Op.in]: existingIds } },
      transaction
    })

    const created = newActors.length > 0
      ? await this.model.bulkCreate(newActors, { returning: true, transaction })
      : []

    return [...found, ...created]
  }

  async create(dto: CreateActorDto): Promise<ActorInstance> {
    const actor = await this.model.create({
      name: dto.name,
    });
    return actor;
  }
} 