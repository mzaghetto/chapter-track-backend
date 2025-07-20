import { Prisma, Providers } from '@prisma/client'
import { ProvidersRepository } from '../providers-repository'

export class InMemoryProvidersRepository implements ProvidersRepository {
  public items: Providers[] = []

  async create(data: Prisma.ProvidersCreateInput): Promise<Providers> {
    const provider = {
      id: data.id ? BigInt(data.id.toString()) : BigInt(this.items.length + 1),
      name: data.name,
      url: data.url ?? null,
      isActive: data.isActive ?? true,
      createdAt: data.createdAt ?? new Date(),
      updatedAt: data.updatedAt ?? new Date(),
    } as Providers

    this.items.push(provider)

    return provider
  }

  async findByName(name: string): Promise<Providers | null> {
    const provider = this.items.find((item) => item.name === name)

    if (!provider) {
      return null
    }

    return provider
  }

  async findById(id: bigint): Promise<Providers | null> {
    const provider = this.items.find((item) => item.id === id)

    if (!provider) {
      return null
    }

    return provider
  }

  async findAll(): Promise<Providers[]> {
    return this.items
  }

  async update(
    id: bigint,
    data: Prisma.ProvidersUpdateInput,
  ): Promise<Providers | null> {
    const providerIndex = this.items.findIndex((item) => item.id === id)

    if (providerIndex === -1) {
      return null
    }

    const updatedProvider = {
      ...this.items[providerIndex],
      ...data,
      updatedAt: new Date(),
    } as Providers

    this.items[providerIndex] = updatedProvider

    return updatedProvider
  }

  async delete(id: bigint): Promise<void> {
    const providerIndex = this.items.findIndex((item) => item.id === id)

    if (providerIndex === -1) {
      throw new Error('Provider not found')
    }

    this.items.splice(providerIndex, 1)
  }
}
