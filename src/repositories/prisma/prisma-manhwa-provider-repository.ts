import { ManhwaProvider, Prisma } from '@prisma/client'
import { ManhwaProviderRepository } from '../manhwa-provider-repository'
import { prisma } from '@/lib/prisma'

export class PrismaManhwaProviderRepository implements ManhwaProviderRepository {
  async create(data: Prisma.ManhwaProviderUncheckedCreateInput): Promise<ManhwaProvider> {
    const manhwaProvider = await prisma.manhwaProvider.create({
      data,
    })

    return manhwaProvider
  }

  async findByManhwaIdAndProviderId(
    manhwaId: bigint,
    providerId: bigint,
  ): Promise<ManhwaProvider | null> {
    const manhwaProvider = await prisma.manhwaProvider.findFirst({
      where: {
        manhwaId,
        providerId,
      },
    })

    return manhwaProvider
  }

  async findById(id: bigint): Promise<ManhwaProvider | null> {
    const manhwaProvider = await prisma.manhwaProvider.findUnique({
      where: {
        id,
      },
    })

    return manhwaProvider
  }

  async update(
    id: bigint,
    data: Prisma.ManhwaProviderUpdateInput,
  ): Promise<ManhwaProvider> {
    const updatedManhwaProvider = await prisma.manhwaProvider.update({
      where: {
        id,
      },
      data,
    })

    return updatedManhwaProvider
  }

  async delete(id: bigint): Promise<void> {
    await prisma.manhwaProvider.delete({
      where: {
        id,
      },
    })
  }
}