import { Model, DataTypes, Sequelize } from 'sequelize'
import { ActorInstance, CreateActorAttributes } from './actor'
import { UserInstance } from './user'
import { Type } from 'class-transformer'
import { IsString, IsInt, IsEnum, ValidateNested, IsArray } from 'class-validator'
import { CreateActorDto } from 'modules/actor/actor.repository'

export enum MovieFormat { VHS = 'VHS', DVD = 'DVD', BLU_RAY = 'Blu-Ray' }
export enum MovieSourceType { FILESYSTEM = 'FILESYSTEM', WEB = 'WEB' }

export interface MovieSource {
  type: MovieSourceType
  value?: string
}

export class CreateMovieAttributes {
  @IsString()
  title!: string

  @IsInt()
  year!: number

  @IsEnum(MovieFormat)
  format!: MovieFormat

  source!: MovieSource

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateActorAttributes)
  actors!: CreateActorAttributes[]
}

export interface CreateMovieRepositoryAttributes {
  title: string
  year: number

  format: MovieFormat
  source: MovieSource
  actors: ActorInstance[]
}

export interface MovieAttributes {
  id: number
  title: string
  year: number

  format: MovieFormat
  source: MovieSource

  userId: number

  readonly createdAt: Date
  readonly updatedAt: Date
}

export interface MovieInstance
  extends Model<
    MovieAttributes,
    Omit<MovieAttributes, 'id' | 'createdAt' | 'updatedAt'>
  >,
  MovieAttributes {
  user: UserInstance
  actors: ActorInstance[]
}

export const MovieModel = (sequelize: Sequelize) =>
  sequelize.define<MovieInstance>('Movie', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    format: {
      type: DataTypes.ENUM('VHS', 'DVD', 'Blu-Ray'),
      allowNull: false,
    },
    source: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    userId: {
      field: 'user_id',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    tableName: 'movies',
    timestamps: true,
  }) 