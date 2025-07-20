import { ManhwaProvider, Prisma } from '@prisma/client'
import {
  FindAllFilters,
  ManhwaProviderRepository,
} from '../manhwa-provider-repository'
import { DetailedManhwaProvider } from '../dtos/detailed-manhwa-provider'

export class InMemoryManhwaProviderRepository
  implements ManhwaProviderRepository
{
  public items: (ManhwaProvider & {
    manhwa?: { name: string }
    provider?: { name: string }
  })[] = []

  async create(
    data: Prisma.ManhwaProviderUncheckedCreateInput,
    manhwa?: { name: string },
    provider?: { name: string },
  ): Promise<ManhwaProvider> {
    const manhwaProvider = {
      id: data.id ? BigInt(data.id.toString()) : BigInt(this.items.length + 1),
      manhwaId: BigInt(data.manhwaId),
      providerId: BigInt(data.providerId),
      lastEpisodeReleased: data.lastEpisodeReleased ?? null,
      url: data.url ?? null,
      createdAt: data.createdAt ?? new Date(),
      updatedAt: data.updatedAt ?? new Date(),
      manhwa,
      provider,
    } as ManhwaProvider & {
      manhwa?: { name: string }
      provider?: { name: string }
    }

    this.items.push(manhwaProvider)

    return manhwaProvider
  }

  async findByManhwaIdAndProviderId(
    manhwaId: bigint,
    providerId: bigint,
  ): Promise<ManhwaProvider | null> {
    return (
      this.items.find(
        (item) => item.manhwaId === manhwaId && item.providerId === providerId,
      ) ?? null
    )
  }

  async findById(id: bigint): Promise<ManhwaProvider | null> {
    const manhwaProvider = this.items.find((item) => item.id === id)

    if (!manhwaProvider) {
      return null
    }

    return manhwaProvider
  }

  async findAll(filters: FindAllFilters): Promise<DetailedManhwaProvider[]> {
    return this.items
      .filter(
        (item) =>
          (!filters.manhwaId || item.manhwaId === filters.manhwaId) &&
          (!filters.providerId || item.providerId === filters.providerId) &&
          (!filters.manhwaName ||
            (item.manhwa &&
              item.manhwa.name
                .toLowerCase()
                .includes(filters.manhwaName.toLowerCase()))) &&
          (!filters.providerName ||
            (item.provider &&
              item.provider.name
                .toLowerCase()
                .includes(filters.providerName.toLowerCase()))),
      )
      .map((manhwaProvider) => ({
        id: manhwaProvider.id,
        manhwaId: manhwaProvider.manhwaId,
        manhwaName: manhwaProvider.manhwa?.name || '',
        providerId: manhwaProvider.providerId,
        providerName: manhwaProvider.provider?.name || '',
        lastEpisodeReleased: manhwaProvider.lastEpisodeReleased,
        url: manhwaProvider.url,
        createdAt: manhwaProvider.createdAt,
        updatedAt: manhwaProvider.updatedAt,
      }))
  }

  async update(
    id: bigint,
    data: Prisma.ManhwaProviderUpdateInput,
  ): Promise<ManhwaProvider | null> {
    const manhwaProviderIndex = this.items.findIndex((item) => item.id === id)

    if (manhwaProviderIndex === -1) {
      return null
    }

    const updatedManhwaProvider = {
      ...this.items[manhwaProviderIndex],
      ...data,
      updatedAt: new Date(),
    } as ManhwaProvider

    this.items[manhwaProviderIndex] = updatedManhwaProvider

    return updatedManhwaProvider
  }

  async delete(id: bigint): Promise<void> {
    const manhwaProviderIndex = this.items.findIndex((item) => item.id === id)

    if (manhwaProviderIndex === -1) {
      throw new Error('ManhwaProvider not found')
    }

    this.items.splice(manhwaProviderIndex, 1)
  }
}
