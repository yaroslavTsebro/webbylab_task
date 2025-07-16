import { UserService } from 'modules/user/user.service'
import { RegisterDto, LoginDto } from 'shared/contracts/system/jwt'
import { User } from 'shared/contracts/entities/user'

export interface AuthStrategy<TPayload, TResult> {
  execute(payload: TPayload): Promise<TResult>
}

export class RegisterStrategy implements AuthStrategy<RegisterDto, User> {
  constructor(private readonly userService: UserService) { }
  async execute(payload: RegisterDto) {
    return this.userService.createUser(payload)
  }
}

export class LoginStrategy implements AuthStrategy<LoginDto, User> {
  constructor(private readonly userService: UserService) { }
  async execute(payload: LoginDto) {
    const isValid = await this.userService.verifyPassword(payload.email, payload.password)
    if (!isValid) throw new Error('Invalid credentials')

    const user = await this.userService.findByEmail(payload.email)
    if (!user) throw new Error('User not found')

    return user;
  }
} 