import { MovieFormat, MovieInstance, MovieSource } from '@/shared/entities/movie'

export class Movie {
  constructor(private readonly movie: MovieInstance) { }

  get id() {
    return this.movie.id
  }

  get title(): string {
    return this.movie.title
  }

  set title(title: string) {
    this.movie.title = title
  }

  get year(): number {
    return this.movie.year
  }

  set year(year: number) {
    this.movie.year = year
  }

  get format(): MovieFormat {
    return this.movie.format
  }

  set format(format: MovieFormat) {
    this.movie.format = format
  }

  get source(): MovieSource {
    return this.movie.source
  }

  set source(source: MovieSource) {
    this.movie.source = source
  }

  public getObject() {
    return this.movie
  }
}
