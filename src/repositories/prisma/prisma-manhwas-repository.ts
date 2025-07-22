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

  async filterByName(name: string): Promise<
    | (Manhwas & {
        manhwaProviders: {
          lastEpisodeReleased: number | null
        }[]
      })[]
    | null
  > {
    const manhwa = await prisma.manhwas.findMany({
      where: {
        name: {
          mode: 'insensitive',
          contains: name,
        },
      },
      include: {
        manhwaProviders: true,
      },
    })

    return manhwa
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
}
