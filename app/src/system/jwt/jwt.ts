import { IJwtPayload, IJwtService, JwtTokens } from '../../shared/contracts/system/jwt';
import * as jsonwebtoken from 'jsonwebtoken';
import { envConfig } from '../config/config';

const {
  public_key,
  private_key,
  expireTime,
  refreshTokenExpireTime,
  rtSecret,
} = envConfig.jwt;

export class JwtService implements IJwtService {
  private constructor(private readonly jwt: typeof jsonwebtoken) {}

  static init(jwtLib: typeof jsonwebtoken = jsonwebtoken): JwtService {
    return new JwtService(jwtLib);
  }

  public sign(payload: IJwtPayload): JwtTokens {
    const accessOptions: jsonwebtoken.SignOptions = {
      algorithm: 'RS256',
      expiresIn: expireTime,
    };
    const refreshOptions: jsonwebtoken.SignOptions = {
      expiresIn: refreshTokenExpireTime,
    };

    const accessToken = this.jwt.sign(
      payload,
      private_key as jsonwebtoken.Secret,
      accessOptions
    );

    const refreshToken = this.jwt.sign(
      payload,
      rtSecret as jsonwebtoken.Secret,
      refreshOptions
    );

    return { accessToken, refreshToken };
  }

  public verifyAccess(token: string): IJwtPayload {
    const verifyOptions: jsonwebtoken.VerifyOptions = {
      algorithms: ['RS256'],
    };
    const decoded = this.jwt.verify(
      token,
      public_key as jsonwebtoken.Secret,
      verifyOptions
    );
    return decoded as IJwtPayload;
  }

  public verifyRefresh(token: string): IJwtPayload {
    const decoded = this.jwt.verify(
      token,
      rtSecret as jsonwebtoken.Secret
    );
    return decoded as IJwtPayload;
  }
}
