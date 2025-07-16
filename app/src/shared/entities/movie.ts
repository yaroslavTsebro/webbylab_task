import { Model, DataTypes, Sequelize } from 'sequelize'
import { ActorInstance } from './actor'
import { UserInstance } from './user'

export enum MovieFormat { VHS = 'VHS', DVD = 'DVD', BLU_RAY = 'Blu-ray' }
export enum MovieSourceType { FILESYSTEM = 'FILESYSTEM', WEB = 'WEB' }

export interface MovieSource {
  type: MovieSourceType
  value?: string
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
      type: DataTypes.ENUM('VHS', 'DVD', 'Blu-ray'),
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