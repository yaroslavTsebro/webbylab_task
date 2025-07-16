import { IJwtPayload, IJwtService, JwtTokens } from '../../shared/contracts/system/jwt'
import * as jsonwebtoken from 'jsonwebtoken'
import { envConfig } from '../config/config'

const {
  public_key,
  private_key,
  expireTime,
  refreshTokenExpireTime,
  rtSecret,
} = envConfig.jwt

export class JwtService implements IJwtService {
  private constructor(private readonly jwt: typeof jsonwebtoken) { }

  static init(jwtLib: typeof jsonwebtoken = jsonwebtoken): JwtService {
    return new JwtService(jwtLib)
  }

  public async sign(payload: IJwtPayload): Promise<JwtTokens> {
    const accessToken = await this.signAsync(
      payload,
      private_key as jsonwebtoken.Secret,
      {
        algorithm: 'RS256',
        expiresIn: expireTime,
      }
    )

    const refreshToken = await this.signAsync(
      payload,
      rtSecret as jsonwebtoken.Secret,
      {
        expiresIn: refreshTokenExpireTime,
      }
    )

    return { accessToken, refreshToken }
  }

  public async verifyAccess(token: string): Promise<IJwtPayload> {
    const decoded = await this.verifyAsync(
      token,
      public_key as jsonwebtoken.Secret,
      { algorithms: ['RS256'] }
    )
    return decoded as IJwtPayload
  }

  public async verifyRefresh(token: string): Promise<IJwtPayload> {
    const decoded = await this.verifyAsync(token, rtSecret as jsonwebtoken.Secret)
    return decoded as IJwtPayload
  }

  private verifyAsync(
    token: string,
    secret: jsonwebtoken.Secret,
    options?: jsonwebtoken.VerifyOptions
  ): Promise<jsonwebtoken.JwtPayload | string> {
    return new Promise((resolve, reject) => {
      jsonwebtoken.verify(token, secret, options || {}, (err, decoded) => {
        if (err || !decoded) return reject(err)
        resolve(decoded)
      })
    })
  }


  private signAsync(
    payload: string | object | Buffer,
    secret: jsonwebtoken.Secret,
    options?: jsonwebtoken.SignOptions
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      jsonwebtoken.sign(payload, secret, options || {}, (err, token) => {
        if (err || !token) return reject(err)
        resolve(token)
      })
    })
  }

}
