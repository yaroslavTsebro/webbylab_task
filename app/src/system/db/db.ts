import { ActorModel } from '../../shared/entities/actor';
import { MovieModel } from '../../shared/entities/movie';
import { UserModel } from '../../shared/entities/user';
import { envConfig } from '../config/config';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(envConfig.dbUri, {
  dialect: 'postgres',
  pool: {
    max: 15,
    min: 0,
    acquire: 300000,
    idle: 100000,
  },
  logging: false,
})

const User = UserModel(sequelize)
const Movie = MovieModel(sequelize)
const Actor = ActorModel(sequelize)

Movie.belongsToMany(Actor, { through: 'MovieActors', as: 'actors', foreignKey: 'movieId' })
Actor.belongsToMany(Movie, { through: 'MovieActors', as: 'movies', foreignKey: 'actorId' })

// Movie принадлежит User
Movie.belongsTo(User, { foreignKey: 'userId', as: 'user' })
User.hasMany(Movie, { foreignKey: 'userId', as: 'movies' })

export {
  User,
  Movie,
  Actor,
  sequelize,
}