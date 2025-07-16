import { IsEmail, IsString, MinLength } from 'class-validator';

export interface JwtTokens {
  accessToken: string;
  refreshToken: string;
};

export interface IJwtPayload {
  id: number;
  secret: string;
};

export interface IJwtService {
  verifyAccess(token: string): Promise<IJwtPayload>
  verifyRefresh(token: string): Promise<IJwtPayload>
  sign(payload: IJwtPayload): Promise<JwtTokens>
}

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  name!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

export class RefreshDto {
  @IsString()
  refreshToken!: string;
}