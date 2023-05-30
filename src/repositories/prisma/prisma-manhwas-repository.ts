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

  async findByName(name: string): Promise<Prisma.ManhwasCreateInput | null> {
    const manhwa = await prisma.manhwas.findFirst({
      where: {
        name,
      },
    })

    return manhwa
  }

  findByIDAndUpdate(
    manhwaID: string,
    data: string | Prisma.ManhwasUpdateInput,
  ): Promise<Manhwas | null> {
    throw new Error('Method not implemented.')
  }

  async findByID(manhwaID: string): Promise<Manhwas | null> {
    const manhwa = await prisma.manhwas.findFirst({
      where: {
        id: manhwaID,
      },
    })

    return manhwa
  }
}
