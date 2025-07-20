import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryManhwaProviderRepository } from '@/repositories/in-memory/in-memory-manhwa-provider-repository'
import { UpdateManhwaProviderUseCase } from './update-manhwa-provider'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'

let manhwaProviderRepository: InMemoryManhwaProviderRepository
let sut: UpdateManhwaProviderUseCase

describe('Update Manhwa Provider Use Case', () => {
  beforeEach(async () => {
    manhwaProviderRepository = new InMemoryManhwaProviderRepository()
    sut = new UpdateManhwaProviderUseCase(manhwaProviderRepository)

    await manhwaProviderRepository.create({
      id: BigInt(1),
      manhwaId: BigInt(1),
      providerId: BigInt(1),
      lastEpisodeReleased: 100,
      url: 'http://example.com',
    })
  })

  it('should be able to update a manhwa provider', async () => {
    const { manhwaProvider } = await sut.execute({
      manhwaProviderId: BigInt(1),
      data: {
        lastEpisodeReleased: 101,
      },
    })

    expect(manhwaProvider.lastEpisodeReleased).toEqual(101)
  })

  it('should not be able to update a non-existing manhwa provider', async () => {
    await expect(async () =>
      sut.execute({
        manhwaProviderId: BigInt(99),
        data: {
          lastEpisodeReleased: 101,
        },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
