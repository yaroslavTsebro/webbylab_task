import { IUserAttributes } from '@/shared/contracts/entities/user'

export class UserFactory {
  static async build({ email, name, password }: { email: string; name: string; password: string }): Promise<Omit<IUserAttributes, 'id' | 'createdAt' | 'updatedAt'>> {
    return {
      email,
      name,
      password,
    }
  }
}
