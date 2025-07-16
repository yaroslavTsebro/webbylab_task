export interface ParsedMovie {
  title: string;
  year: number;
  format: string;
  actors: { name: string }[];
}

export class MovieParser {
  static parse(content: string): ParsedMovie[] {
    const movies: ParsedMovie[] = []
    const blocks = content.split(/\n\s*\n/)

    blocks.forEach((block, index) => {
      const lines = block.split('\n').map(line => line.trim())
      const data: Record<string, string> = {}

      for (const line of lines) {
        if (line.startsWith('Title:')) {
          data.title = line.slice(6).trim()
        } else if (line.startsWith('Release Year:')) {
          data.year = line.slice(13).trim()
        } else if (line.startsWith('Format:')) {
          data.format = line.slice(7).trim()
        } else if (line.startsWith('Stars:')) {
          data.actors = line.slice(6).trim()
        }
      }

      if (!data.title || !data.year || !data.format || !data.actors) {
        throw new Error(
          `Invalid movie block at index ${index} - missing one of required fields.\nBlock:\n${block}`
        )
      }

      const actors = data.actors.split(',').map(name => ({ name: name.trim() }))
      const year = parseInt(data.year, 10)
      if (isNaN(year)) {
        throw new Error(`Invalid year at index ${index}: "${data.year}"`)
      }

      movies.push({
        title: data.title,
        year,
        format: data.format,
        actors,
      })
    })

    return movies
  }
}
