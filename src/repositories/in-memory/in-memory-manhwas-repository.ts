import { Manhwas, Prisma } from '@prisma/client'
import { ManhwasRepository } from '../manhwas-repository'
import { InMemoryManhwaProviderRepository } from './in-memory-manhwa-provider-repository'

export class InMemoryManhwasRepository implements ManhwasRepository {
  public items: Manhwas[] = []

  constructor(
    private manhwaProviderRepository?: InMemoryManhwaProviderRepository,
  ) {}

  async create(
    data: Prisma.ManhwasCreateInput & { manhwaProviders?: any[] },
  ): Promise<Manhwas> {
    const manhwa = {
      id: data.id ? BigInt(data.id.toString()) : BigInt(this.items.length + 1),
      name: data.name,
      author: data.author ?? null,
      genre: data.genre ?? null,
      coverImage: data.coverImage ?? null,
      description: data.description ?? null,
      status: data.status ?? null,
      createdAt: data.createdAt ?? new Date(),
      updatedAt: data.updatedAt ?? new Date(),
      manhwaProviders: data.manhwaProviders ?? [],
    } as Manhwas & { manhwaProviders: any[] }

    if (this.manhwaProviderRepository && data.manhwaProviders) {
      data.manhwaProviders.forEach((provider) => {
        this.manhwaProviderRepository?.items.push(provider)
      })
    }

    this.items.push(manhwa)

    return manhwa
  }

  async findByName(name: string): Promise<Manhwas | null> {
    const manhwa = this.items.find((item) => item.name === name)

    if (!manhwa) {
      return Promise.resolve(null)
    }

    return Promise.resolve(manhwa)
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
    let filteredItems = this.items.filter((item) => item.name.includes(name))

    if (genre) {
      filteredItems = filteredItems.filter((item) =>
        JSON.stringify(item.genre).includes(genre),
      )
    }

    if (status) {
      filteredItems = filteredItems.filter((item) => item.status === status)
    }

    const itemsWithProviders = filteredItems.map((manhwa) => {
      let manhwaProviders: any[] = []

      if (this.manhwaProviderRepository) {
        manhwaProviders = this.manhwaProviderRepository.items.filter(
          (item) => item.manhwaId === manhwa.id,
        )
      }

      return {
        ...manhwa,
        manhwaProviders,
      }
    })

    return {
      items: itemsWithProviders,
      totalItems: itemsWithProviders.length,
    }
  }

  async findByID(manhwaID: bigint): Promise<
    | (Manhwas & {
        manhwaProviders: {
          lastEpisodeReleased: number | null
        }[]
      })
    | null
  > {
    const indexOfManhwa = this.items.findIndex((item) => item.id === manhwaID)

    if (indexOfManhwa === -1) {
      return Promise.resolve(null)
    }

    const manhwa = this.items[indexOfManhwa]
    let manhwaProviders: any[] = []

    if (this.manhwaProviderRepository) {
      manhwaProviders = this.manhwaProviderRepository.items.filter(
        (item) => item.manhwaId === manhwa.id,
      )
    }

    return Promise.resolve({
      ...manhwa,
      manhwaProviders,
    })
  }

  async findByIDs(manhwasID: bigint[]): Promise<Manhwas[] | null> {
    const indexOfManhwas = manhwasID.map((manhwa) => {
      return this.items.findIndex((item) => item.id === manhwa)
    })

    if (indexOfManhwas.includes(-1)) {
      return Promise.resolve(null)
    }

    const filteredItems = indexOfManhwas.map((item) => {
      return this.items[item]
    })

    return Promise.resolve(filteredItems)
  }

  async findByIDAndUpdate(
    manhwaID: bigint,
    data: Prisma.ManhwasUpdateInput,
  ): Promise<Manhwas | null> {
    const indexOfManhwa = this.items.findIndex((item) => item.id === manhwaID)

    if (indexOfManhwa === -1) {
      return Promise.resolve(null)
    }

    this.items[indexOfManhwa] = {
      ...this.items[indexOfManhwa],
      ...data,
      id: manhwaID,
    } as Manhwas

    return Promise.resolve(this.items[indexOfManhwa])
  }

  async findRandom(count: number): Promise<Manhwas[]> {
    const shuffled = this.items.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  async delete(id: bigint): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index > -1) {
      this.items.splice(index, 1)
    }
  }
}
