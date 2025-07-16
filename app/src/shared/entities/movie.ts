import { Model, DataTypes, Sequelize } from 'sequelize'
import { ActorInstance } from './actor'

export type MovieFormat = 'VHS' | 'DVD' | 'Blu-ray'
export type MovieSourceType = 'WEB' | 'FILESYSTEM'

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

  readonly createdAt: Date
  readonly updatedAt: Date
}

export interface MovieInstance
  extends Model<
    MovieAttributes,
    Omit<MovieAttributes, 'id' | 'createdAt' | 'updatedAt'>
  >,
  MovieAttributes {
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
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    tableName: 'movies',
    timestamps: true,
  }) 