import { Prisma } from '@prisma/client'

export function parseStringArray(data: any): Prisma.JsonArray | null {
  if (data === undefined || data === null) {
    return null
  }

  if (Array.isArray(data)) {
    return data as Prisma.JsonArray
  } else if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed)) {
        return parsed as Prisma.JsonArray
      } else {
        return data.split(',').map((g: string) => g.trim()) as Prisma.JsonArray
      }
    } catch (e) {
      return data.split(',').map((g: string) => g.trim()) as Prisma.JsonArray
    }
  }
  return null
}
