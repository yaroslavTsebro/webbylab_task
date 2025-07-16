import { MovieFormat, MovieInstance, MovieSource } from 'shared/entities/movie'
import { Movie, Actor } from 'system/db/db'
import { ModelStatic, Op } from 'sequelize'

export class CreateMovieDto {
  title!: string
  year!: number

  format!: MovieFormat
  source!: MovieSource

  actors!: number[]
}

export class MovieRepository {
  private constructor(protected readonly model: ModelStatic<MovieInstance>) { }

  public static init(): MovieRepository {
    return new MovieRepository(Movie)
  }

  async create(movie: CreateMovieDto, userId: number): Promise<MovieInstance> {
    const created = await this.model.create({...movie, userId})
    return created
  }

  async findById(id: number): Promise<MovieInstance | null> {
    return this.model.findByPk(id, { include: [{ model: Actor, as: 'actors' }] })
  }

  async findAllSorted(): Promise<MovieInstance[]> {
    return this.model.findAll({ include: [{ model: Actor, as: 'actors' }], order: [['title', 'ASC']] })
  }

  async findByTitle(title: string): Promise<MovieInstance[]> {
    return this.model.findAll({
      where: { title: { [Op.iLike]: `%${title}%` } },
      include: [{ model: Actor, as: 'actors' }],
      order: [['title', 'ASC']]
    })
  }

  async findByActorName(name: string) {
    return this.model.findAll({
      include: [{
        model: Actor,
        as: 'actors',
        where: { name: { [Op.iLike]: `%${name}%` } }
      }],
      order: [['title', 'ASC']]
    })
  }

  async delete(id: number) {
    return this.model.destroy({ where: { id } })
  }
} 