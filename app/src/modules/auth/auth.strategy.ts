import { UserService } from '../../modules/user/user.service'
import { RegisterDto, LoginDto } from '../../shared/contracts/system/jwt'
import { User } from '../../shared/contracts/entities/user'
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export interface AuthStrategy<TPayload, TResult> {
  execute(payload: TPayload): Promise<TResult>
}

export class RegisterStrategy implements AuthStrategy<RegisterDto, User> {
  constructor(private readonly userService: UserService) { }
  async execute(payload: RegisterDto) {
    const dto = plainToInstance(RegisterDto, payload)
    await validateOrReject(dto)

    return this.userService.createUser(payload)
  }
}

export class LoginStrategy implements AuthStrategy<LoginDto, User> {
  constructor(private readonly userService: UserService) { }
  async execute(payload: LoginDto) {
    const dto = plainToInstance(LoginDto, payload)
    await validateOrReject(dto)

    const user = await this.userService.findByEmail(payload.email)
    if (!user) throw new Error('User not found')

    const isValid = await this.userService.verifyPassword(user.getObject(), payload.password)
    if (!isValid) throw new Error('Invalid credentials')

    return user;
  }
} 