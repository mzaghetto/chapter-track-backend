import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryManhwaProviderRepository } from '@/repositories/in-memory/in-memory-manhwa-provider-repository'
import { InMemoryManhwasRepository } from '@/repositories/in-memory/in-memory-manhwas-repository'
import { InMemoryProvidersRepository } from '@/repositories/in-memory/in-memory-providers-repository'
import { CreateManhwaProviderUseCase } from './create-manhwa-provider'

let manhwaProviderRepository: InMemoryManhwaProviderRepository
let manhwasRepository: InMemoryManhwasRepository
let providersRepository: InMemoryProvidersRepository
let sut: CreateManhwaProviderUseCase

describe('Create Manhwa Provider Use Case', () => {
  beforeEach(() => {
    manhwaProviderRepository = new InMemoryManhwaProviderRepository()
    manhwasRepository = new InMemoryManhwasRepository()
    providersRepository = new InMemoryProvidersRepository()
    sut = new CreateManhwaProviderUseCase(
      manhwaProviderRepository,
      manhwasRepository,
      providersRepository,
    )

    // Create a dummy manhwa and provider for the test
    manhwasRepository.create({
      id: BigInt(1),
      name: 'Test Manhwa',
      status: 'ONGOING',
    })
    providersRepository.create({
      id: BigInt(1),
      name: 'Test Provider',
    })
  })

  it('should be able to create a new manhwa provider', async () => {
    const { manhwaProvider } = await sut.execute({
      manhwaId: BigInt(1),
      providerId: BigInt(1),
      lastEpisodeReleased: 100,
      url: 'http://example.com',
    })

    expect(manhwaProvider.id).toEqual(expect.any(BigInt))
    expect(manhwaProvider.manhwaId).toEqual(BigInt(1))
    expect(manhwaProvider.providerId).toEqual(BigInt(1))
  })
})
