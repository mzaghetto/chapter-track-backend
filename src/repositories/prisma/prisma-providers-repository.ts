import { Prisma, Providers } from '@prisma/client'
import { ProvidersRepository } from '../providers-repository'
import { prisma } from '@/lib/prisma'

export class PrismaProvidersRepository implements ProvidersRepository {
  async create(data: Prisma.ProvidersCreateInput): Promise<Providers> {
    const provider = await prisma.providers.create({
      data,
    })

    return provider
  }

  async findByName(name: string): Promise<Providers | null> {
    const provider = await prisma.providers.findFirst({
      where: {
        name,
      },
    })

    return provider
  }

  async findById(id: bigint): Promise<Providers | null> {
    const provider = await prisma.providers.findUnique({
      where: {
        id,
      },
    })

    return provider
  }

  async update(id: bigint, data: Prisma.ProvidersUpdateInput): Promise<Providers> {
    const updatedProvider = await prisma.providers.update({
      where: {
        id,
      },
      data,
    })

    return updatedProvider
  }

  async delete(id: bigint): Promise<void> {
    await prisma.providers.delete({
      where: {
        id,
      },
    })
  }
}