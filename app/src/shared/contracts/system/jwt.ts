
export interface JwtTokens {
  accessToken: string;
  refreshToken: string;
};

export interface IJwtPayload {
  id: number;
  secret: string;
};

export interface IJwtService {
  verifyAccess(token: string): IJwtPayload
  verifyRefresh(token: string): IJwtPayload
  sign(payload: IJwtPayload): JwtTokens
}

// DTOs для auth
export interface RegisterDto {
  email: string;
  name: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshDto {
  refreshToken: string;
}