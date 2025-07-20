import { ManhwaProvider, Prisma } from '@prisma/client'
import {
  FindAllFilters,
  ManhwaProviderRepository,
} from '../manhwa-provider-repository'
import { prisma } from '@/lib/prisma'
import { DetailedManhwaProvider } from '../dtos/detailed-manhwa-provider'

export class PrismaManhwaProviderRepository
  implements ManhwaProviderRepository
{
  async create(
    data: Prisma.ManhwaProviderUncheckedCreateInput,
  ): Promise<ManhwaProvider> {
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

  async findAll(filters: FindAllFilters): Promise<DetailedManhwaProvider[]> {
    const manhwaProviders = await prisma.manhwaProvider.findMany({
      where: {
        manhwaId: filters.manhwaId,
        providerId: filters.providerId,
        ...(filters.manhwaName && {
          manhwa: {
            name: {
              contains: filters.manhwaName,
              mode: 'insensitive',
            },
          },
        }),
        ...(filters.providerName && {
          provider: {
            name: {
              contains: filters.providerName,
              mode: 'insensitive',
            },
          },
        }),
      },
      include: {
        manhwa: true,
        provider: true,
      },
    })

    return manhwaProviders.map((manhwaProvider) => ({
      id: manhwaProvider.id,
      manhwaId: manhwaProvider.manhwaId,
      manhwaName: manhwaProvider.manhwa.name,
      providerId: manhwaProvider.providerId,
      providerName: manhwaProvider.provider.name,
      lastEpisodeReleased: manhwaProvider.lastEpisodeReleased,
      url: manhwaProvider.url,
      createdAt: manhwaProvider.createdAt,
      updatedAt: manhwaProvider.updatedAt,
    }))
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
