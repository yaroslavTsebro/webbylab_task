import { UserInstance } from '../../entities/user'


export interface IUserAttributes {
  id: number
  email: string
  name: string
  password: string

  readonly createdAt: Date
  readonly updatedAt: Date
}

export class User {
  constructor(private readonly user: UserInstance) { }

  get id() {
    return this.user.id
  }

  get email(): string {
    return this.user.email
  }

  set email(newEmail: string) {
    this.user.email = newEmail
  }

  set name(newName: string) {
    this.user.name = newName
  }

  get name(): string {
    return this.user.name
  }

  public getObject() {
    return this.user
  }
}
