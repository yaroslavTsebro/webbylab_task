import { Model, DataTypes, Sequelize } from 'sequelize'
import { MovieInstance } from './movie'
import { IsOptional, IsInt, Min, IsString, ValidateIf, IsDefined } from 'class-validator';

export class CreateActorAttributes {
  @ValidateIf(o => o.name == null)
  @IsDefined({ message: 'actor.id must be provided when name is absent' })
  @IsInt()
  @Min(1)
  id!: number;

  @ValidateIf(o => o.id == null)
  @IsDefined({ message: 'actor.name must be provided when id is absent' })
  @IsString()
  name!: string;
}

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