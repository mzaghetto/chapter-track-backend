import { Prisma } from '@prisma/client'

export function parseGenre(genre: any): Prisma.JsonArray | null {
  if (genre === undefined || genre === null) {
    return null
  }

  if (Array.isArray(genre)) {
    return genre as Prisma.JsonArray
  } else if (typeof genre === 'string') {
    try {
      const parsed = JSON.parse(genre)
      if (Array.isArray(parsed)) {
        return parsed as Prisma.JsonArray
      } else {
        return genre.split(',').map((g: string) => g.trim()) as Prisma.JsonArray
      }
    } catch (e) {
      return genre.split(',').map((g: string) => g.trim()) as Prisma.JsonArray
    }
  }
  return null
}
