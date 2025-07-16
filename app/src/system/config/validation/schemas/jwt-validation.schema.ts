import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class JwtValidationSchema {
  @IsNotEmpty()
  @IsString()
  public_key!: string

  @IsNotEmpty()
  @IsString()
  private_key!: string

  @IsNotEmpty()
  @IsString()
  secret!: string

  @IsNotEmpty()
  @IsString()
  rtSecret!: string

  @IsNotEmpty()
  @IsNumber()
  expireTime!: number

  @IsNotEmpty()
  @IsNumber()
  refreshTokenExpireTime!: number
}
