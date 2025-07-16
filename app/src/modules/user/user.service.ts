import { UserFactory } from './user.factory'
import { UserRepository } from './user.repository'
import { KeyDerivationService } from '@/system/key-derivation/key-derivation.service'
import { User } from '@/shared/contracts/entities/user'
import { IKeyDerivationService } from '@/shared/contracts/system/key-derivation'

export class UserService {
  private constructor(private readonly userRepository: UserRepository, private readonly keyDerivation: IKeyDerivationService) { }

  public static init() {
    return new UserService(UserRepository.init(), new KeyDerivationService())
  }

  async createUser({ email, name, password }: { email: string; name: string; password: string }): Promise<User> {
    const existing = await this.userRepository.findByEmail(email)

    if (existing) {
      throw new Error('User already exists')
    }

    const hashedPassword = await this.keyDerivation.derive(password)

    const userData = await UserFactory.build({ email, name, password: hashedPassword })
    const rawUser = await this.userRepository.create(userData)

    return new User(rawUser)
  }

  async verifyPassword(email: string, password: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) return false
    
    return this.keyDerivation.verify(password, user.password)
  }

  async getById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id)

    if (!user) throw new Error('User not found')

    return new User(user)
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) return null

    return new User(user)
  }
}
