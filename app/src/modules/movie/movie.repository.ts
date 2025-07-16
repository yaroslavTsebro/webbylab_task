import { ActorInstance } from 'shared/entities/actor'
import { CreateMovieAttributes, CreateMovieRepositoryAttributes, MovieFormat, MovieInstance, MovieSource } from '../../shared/entities/movie'
import { Movie, Actor } from '../../system/db/db'
import { ModelStatic, Op, WhereOptions, Transaction } from 'sequelize'

export class CreateMovieDto {
  title!: string
  year!: number

  format!: MovieFormat
  source!: MovieSource

  actors!: number[]
}

type BatchCreateInput = {
  title: string
  year: number
  format: MovieFormat
  source: MovieSource
  actorIds: number[]
}

export class MovieRepository {
  private constructor(protected readonly model: ModelStatic<MovieInstance>) { }

  public static init(): MovieRepository {
    return new MovieRepository(Movie)
  }

  async create(movie: CreateMovieRepositoryAttributes, userId: number, transaction: Transaction): Promise<MovieInstance> {
    const created = await this.model.create({ ...movie, userId }, { transaction })
    return created
  }

  async findById(id: number): Promise<MovieInstance | null> {
    return this.model.findByPk(id, { include: [{ model: Actor, as: 'actors' }] })
  }

  async searchMovies({ title, actor, fallbackAll }: { title?: string; actor?: string; fallbackAll?: boolean }) {
    const escapeLike = (v: string) => v.replace(/[%_]/g, ch => '\\' + ch)

    const where: WhereOptions = {}
    if (title) {
      where.title = { [Op.iLike]: `%${escapeLike(title)}%` }
    }

    let actorsInclude: any = { model: Actor, as: 'actors' }

    if (actor) {
      actorsInclude = {
        ...actorsInclude,
        where: { name: { [Op.iLike]: `%${escapeLike(actor)}%` } },
        required: true
      }
    }

    if (!title && !actor && fallbackAll) {
      return this.model.findAll({
        include: [actorsInclude],
        order: [['title', 'ASC']],
        subQuery: false
      })
    }

    if (!title && !actor && !fallbackAll) {
      throw new Error('At least one of "title" or "actor" must be provided')
    }

    return this.model.findAll({
      where,
      include: [actorsInclude],
      order: [['title', 'ASC']],
      subQuery: false
    })
  }

  async delete(id: number, transaction: Transaction) {
    return this.model.destroy({ where: { id }, transaction })
  }

  async batchCreate(movies: BatchCreateInput[], userId: number, transaction: Transaction): Promise<MovieInstance[]> {
    if (!movies.length) return []

    const sequelize = this.model.sequelize!
    const t = transaction;
    const rows = movies.map(m => ({
      title: m.title,
      year: m.year,
      format: m.format,
      source: m.source,
      userId
    }))

    const created = await this.model.bulkCreate(rows, {
      transaction: t,
      returning: true
    })

    const linkRows: { movie_id: number; actor_id: number }[] = []
    for (let i = 0; i < created.length; i++) {
      const movieId = created[i].id
      const uniq = [...new Set(movies[i].actorIds)]
      for (const actorId of uniq) {
        linkRows.push({ movie_id: movieId, actor_id: actorId })
      }
    }

    if (linkRows.length) {
      if (sequelize.models.MovieActors) {
        await (sequelize.models.MovieActors as any).bulkCreate(
          linkRows.map(r => ({ movieId: r.movie_id, actorId: r.actor_id })),
          { transaction: t, ignoreDuplicates: true }
        )
      } else {
        const values = linkRows.map(r => `(${r.movie_id},${r.actor_id})`).join(',')
        await sequelize.query(
          `INSERT INTO movie_actors (movie_id, actor_id) VALUES ${values}
           ON CONFLICT DO NOTHING`,
          { transaction: t }
        )
      }
    }

    return this.model.findAll({
      where: { id: created.map(m => m.id) },
      include: [{ model: Actor, as: 'actors' }],
      order: [['title', 'ASC']],
      transaction: t
    })
  }

} 