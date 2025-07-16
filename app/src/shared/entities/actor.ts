import { Model, DataTypes, Sequelize } from 'sequelize'
import { MovieInstance } from './movie'

export interface ActorAttributes {
  id: number
  name: string

  readonly createdAt: Date
  readonly updatedAt: Date
}

export interface ActorInstance
  extends Model<
    ActorAttributes,
    Omit<ActorAttributes, 'id' | 'createdAt' | 'updatedAt'>
  >,
  ActorAttributes { 
    movies?: MovieInstance[]
  }

export const ActorModel = (sequelize: Sequelize) =>
  sequelize.define<ActorInstance>('Actor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    tableName: 'actors',
    timestamps: true,
  }) 