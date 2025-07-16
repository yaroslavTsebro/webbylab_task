import { ActorInstance } from 'shared/entities/actor'
import { Actor } from 'system/db/db'
import { ModelStatic, Op } from 'sequelize'

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

  async create(dto: CreateActorDto): Promise<ActorInstance> {
    const actor = await this.model.create({
      name: dto.name,
    });
    return actor;
  }
} 