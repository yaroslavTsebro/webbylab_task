import { CreateMovieAttributes, CreateMovieRepositoryAttributes, MovieFormat, MovieSource, MovieSourceType } from '../../shared/entities/movie';
import { MovieRepository } from './movie.repository'
import { ActorRepository } from '../../modules/actor/actor.repository';
import { MovieParser } from '../../shared/utils/movie-parser';
import { sequelize } from '../../system/db/db';
import { CreateActorAttributes } from 'shared/entities/actor';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';

interface BatchCreateInput {
  title: string
  year: number
  format: MovieFormat
  source: MovieSource
  actorIds: number[]
}


export class MovieService {

  private constructor(private readonly movieRepo: MovieRepository, private readonly actorsRepo: ActorRepository) { }

  public static init() {
    return new MovieService(MovieRepository.init(), ActorRepository.init())
  }

  async getById(id: number) {
    return this.movieRepo.findById(id)
  }

  async searchMovies(params: { title?: string; actor?: string; fallbackAll?: boolean }) {
    return this.movieRepo.searchMovies(params)
  }

  async create(movie: CreateMovieAttributes, userId: number) {
    return sequelize.transaction(async (transaction) => {

      const dto = plainToInstance(CreateMovieAttributes, movie)
      await validateOrReject(dto)

      const { actors, ...movieData } = movie;

      const existingActors = await this.actorsRepo.getOrCreateBatch(actors, transaction);

      return this.movieRepo.create(
        { ...movieData, actors: existingActors } as CreateMovieRepositoryAttributes,
        userId,
        transaction
      );
    });
  }

  async delete(id: number) {
    return sequelize.transaction(async (transaction) => {
      return this.movieRepo.delete(id, transaction);
    });
  }

  async importFromBuffer(file: Express.Multer.File, userId: number) {
    return sequelize.transaction(async (transaction) => {
      const content = file.buffer.toString('utf-8');
      const movies = MovieParser.parse(content);

      const allActors = await this.actorsRepo.getOrCreateBatch(
        movies.flatMap(m => m.actors) as CreateActorAttributes[],
        transaction
      );

      const actorMap = new Map(
        allActors.map(a => [a.name.toLowerCase(), a.id])
      );

      const fileSource: MovieSource = { type: MovieSourceType.FILESYSTEM, value: file.filename };

      const toCreate: BatchCreateInput[] = movies.map(m => {
        const ids = m.actors
          .map(actor => actorMap.get(actor.name.toLowerCase()))
          .filter((id): id is number => typeof id === 'number');

        return {
          title: m.title,
          year: m.year,
          format: m.format as MovieFormat,
          source: fileSource,
          actorIds: [...new Set(ids)]
        };
      });

      return this.movieRepo.batchCreate(toCreate, userId, transaction);
    });
  }
} 