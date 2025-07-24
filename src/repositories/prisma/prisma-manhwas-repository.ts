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
    const whereClause: Prisma.ManhwasWhereInput = {
      name: {
        mode: 'insensitive',
        contains: name,
      },
    }

    if (genre) {
      whereClause.genre = {
        path: ['genres'],
        array_contains: genre,
      }
    }

    if (status) {
      whereClause.status = status
    }

    const manhwa = await prisma.manhwas.findMany({
      where: whereClause,
      include: {
        manhwaProviders: true,
      },
    })

    const totalItems = await prisma.manhwas.count({
      where: whereClause,
    })

    return {
      items: manhwa,
      totalItems,
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
