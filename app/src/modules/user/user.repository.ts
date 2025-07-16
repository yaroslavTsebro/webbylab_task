import { UserInstance } from '../../shared/entities/user'
import { IUserAttributes } from '../../shared/contracts/entities/user'
import { ModelStatic } from 'sequelize'
import { User } from '../../system/db/db'

export class UserRepository {
  private constructor(protected readonly model: ModelStatic<UserInstance>) { }

  public static init(): UserRepository {
    return new UserRepository(User)
  }

  async create(user: Omit<IUserAttributes, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserInstance> {
    return this.model.create(user as any)
  }

  async findByEmail(email: string): Promise<UserInstance | null> {
    return this.model.findOne({ where: { email } })
  }

  async findById(id: number): Promise<UserInstance | null> {
    return this.model.findByPk(id)
  }
}
