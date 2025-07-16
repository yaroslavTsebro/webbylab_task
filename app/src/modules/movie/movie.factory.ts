import { MovieAttributes, MovieFormat, MovieSource } from '@/shared/entities/movie';

export interface MovieFactoryData {
  title: string
  year: number

  format: MovieFormat
  source: MovieSource
}

export class MovieFactory {
  static async build(data: MovieFactoryData): Promise<MovieAttributes> {
    return {
      id: 0, // Placeholder, will be set by the database
      title: data.title,
      year: data.year,
      format: data.format,
      source: data.source,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }
}
