import { ManhwaProvider, Prisma } from '@prisma/client'
import { ManhwaProviderRepository } from '../manhwa-provider-repository'

export class InMemoryManhwaProviderRepository implements ManhwaProviderRepository {
  public items: ManhwaProvider[] = []

  async create(data: Prisma.ManhwaProviderUncheckedCreateInput): Promise<ManhwaProvider> {
    const manhwaProvider = {
      id: data.id ? BigInt(data.id.toString()) : BigInt(this.items.length + 1),
      manhwaId: BigInt(data.manhwaId),
      providerId: BigInt(data.providerId),
      lastEpisodeReleased: data.lastEpisodeReleased ?? null,
      url: data.url ?? null,
      createdAt: data.createdAt ?? new Date(),
      updatedAt: data.updatedAt ?? new Date(),
    } as ManhwaProvider

    this.items.push(manhwaProvider)

    return manhwaProvider
  }

  async findByManhwaIdAndProviderId(
    manhwaId: bigint,
    providerId: bigint,
  ): Promise<ManhwaProvider | null> {
    const manhwaProvider = this.items.find(
      (item) => item.manhwaId === manhwaId && item.providerId === providerId,
    )

    if (!manhwaProvider) {
      return null
    }

    return manhwaProvider
  }

  async findById(id: bigint): Promise<ManhwaProvider | null> {
    const manhwaProvider = this.items.find((item) => item.id === id)

    if (!manhwaProvider) {
      return null
    }

    return manhwaProvider
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