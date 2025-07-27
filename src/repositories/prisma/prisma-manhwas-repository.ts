import { Manhwas, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { ManhwasRepository } from '../manhwas-repository'

export class PrismaManhwasRepository implements ManhwasRepository {
  async create(data: Prisma.ManhwasCreateInput): Promise<Manhwas> {
    const manhwa = await prisma.manhwas.create({
      data,
    })

    return manhwa
  }

  async findByName(name: string): Promise<Manhwas | null> {
    const manhwa = await prisma.manhwas.findFirst({
      where: {
        name,
      },
    })

    return manhwa
  }

  async filterByName(
    name: string,
    genre?: string,
    status?: 'ONGOING' | 'COMPLETED' | 'HIATUS',
  ): Promise<{
    items: (Manhwas & {
      manhwaProviders: {
        lastEpisodeReleased: number | null
      }[]
    })[]
    totalItems: number
  } | null> {
    const whereConditions: string[] = []

    if (name) {
      whereConditions.push(
        `("name" ILIKE '%${name}%' OR EXISTS(SELECT 1 FROM jsonb_array_elements_text("alternativeNames") AS elem WHERE elem ILIKE '%${name}%'))`,
      )
    }

    if (genre) {
      whereConditions.push(`"genre" @> '["${genre}"]'`)
    }

    if (status) {
      whereConditions.push(`"status" = '${status}'`)
    }

    const whereClause =
      whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    const manhwa = await prisma.$queryRaw<Manhwas[]>(
      Prisma.sql`SELECT * FROM "Manhwas" ${Prisma.raw(whereClause)}`,
    )

    const manhwaIds = manhwa.map((m) => m.id)
    const manhwaProviders = await prisma.manhwaProvider.findMany({
      where: {
        manhwaId: {
          in: manhwaIds,
        },
      },
    })

    const itemsWithProviders = manhwa.map((m) => ({
      ...m,
      manhwaProviders: manhwaProviders.filter((mp) => mp.manhwaId === m.id),
    }))

    const totalItems = await prisma.$queryRaw<[{ count: bigint }]>(
      Prisma.sql`SELECT COUNT(*) FROM "Manhwas" ${Prisma.raw(whereClause)}`,
    )

    return {
      items: itemsWithProviders,
      totalItems: Number(totalItems[0].count),
    }
  }

  findByIDAndUpdate(
    manhwaID: bigint,
    data: Prisma.ManhwasUpdateInput,
  ): Promise<Manhwas | null> {
    const updatedManhwa = prisma.manhwas.update({
      where: {
        id: manhwaID,
      },
      data: {
        ...data,
      },
    })

    return updatedManhwa
  }

  async findByID(manhwaID: bigint): Promise<
    | (Manhwas & {
        manhwaProviders: {
          lastEpisodeReleased: number | null
        }[]
      })
    | null
  > {
    const manhwa = await prisma.manhwas.findFirst({
      where: {
        id: manhwaID,
      },
      include: {
        manhwaProviders: true,
      },
    })

    return manhwa
  }

  async findByIDs(manhwasID: bigint[]): Promise<Manhwas[] | null> {
    const manhwa = await prisma.manhwas.findMany({
      where: {
        id: {
          in: manhwasID,
        },
      },
    })

    return manhwa
  }

  async delete(id: bigint): Promise<void> {
    await prisma.manhwas.delete({
      where: {
        id,
      },
    })
  }

  async findRandom(count: number): Promise<Manhwas[]> {
    const totalManhwas = await prisma.manhwas.count()
    if (totalManhwas === 0) {
      return []
    }

    const skip = Math.floor(Math.random() * Math.max(0, totalManhwas - count))

    const randomManhwas = await prisma.manhwas.findMany({
      take: count,
      skip,
    })

    return randomManhwas
  }
}
