import { IUserAttributes } from '../contracts/entities/user'
import { Model, DataTypes, Sequelize } from 'sequelize'

export interface UserInstance
  extends Model<IUserAttributes>,
  IUserAttributes {
}

const UserModel = (sequelize: Sequelize) =>
  sequelize.define<UserInstance>(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: 'users',
      timestamps: true,
    },
  )

export { UserModel }