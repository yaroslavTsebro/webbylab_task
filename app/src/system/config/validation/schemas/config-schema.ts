import { Type } from 'class-transformer'
import { IsNotEmpty, IsString, IsInt, Min, IsOptional, IsNotEmptyObject, ValidateNested, ValidateIf, NotEquals } from 'class-validator'
import 'reflect-metadata'
import { JwtValidationSchema } from './jwt-validation.schema'


export class AppConfigValidationSchema {
  @IsNotEmpty()
  @IsString()
  dbUri!: string

  @IsOptional()
  @IsInt()
  appPort?: number

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => JwtValidationSchema)
  jwt!: JwtValidationSchema
}
