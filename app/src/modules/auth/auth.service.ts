import { IJwtService, RegisterDto, LoginDto, RefreshDto } from 'shared/contracts/system/jwt'
import { makeJwtService } from 'system/jwt/factory'
import { UserService } from '../user/user.service'
import { RegisterStrategy, LoginStrategy } from './auth.strategy'

export class AuthService {
  private constructor(
    private readonly userService = UserService.init(),
    private readonly jwtService: IJwtService = makeJwtService()
  ) { }

  public static init(): AuthService {
    return new AuthService()
  }

  async register(dto: RegisterDto) {
    const strategy = new RegisterStrategy(this.userService)
    return await strategy.execute(dto)
  }

  async login(dto: LoginDto) {
    const strategy = new LoginStrategy(this.userService)
    const user = await strategy.execute(dto)

    const payload = { id: user.id, secret: process.env.JWT_SECRET! }
    const tokens = this.jwtService.sign(payload)

    return { user, ...tokens }
  }

  async refresh(dto: RefreshDto) {
    if (!dto.refreshToken) {
      throw new Error('No refresh token provided')
    }
    const payload = this.jwtService.verifyRefresh(dto.refreshToken)
    return this.jwtService.sign(payload)
  }
}
