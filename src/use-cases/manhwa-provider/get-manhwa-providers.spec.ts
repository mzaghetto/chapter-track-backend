import { InMemoryManhwaProviderRepository } from '@/repositories/in-memory/in-memory-manhwa-provider-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetManhwaProvidersUseCase } from './get-manhwa-providers'

describe('Get Manhwa Providers Use Case', () => {
  let manhwaProviderRepository: InMemoryManhwaProviderRepository
  let sut: GetManhwaProvidersUseCase

  beforeEach(() => {
    manhwaProviderRepository = new InMemoryManhwaProviderRepository()
    sut = new GetManhwaProvidersUseCase(manhwaProviderRepository)
  })

  it('should be able to get a list of manhwa providers', async () => {
    await manhwaProviderRepository.create(
      { manhwaId: 1n, providerId: 1n },
      { name: 'Manhwa A' },
      { name: 'Provider X' },
    )
    await manhwaProviderRepository.create(
      { manhwaId: 1n, providerId: 2n },
      { name: 'Manhwa B' },
      { name: 'Provider Y' },
    )
    await manhwaProviderRepository.create(
      { manhwaId: 2n, providerId: 1n },
      { name: 'Manhwa C' },
      { name: 'Provider Z' },
    )

    const { manhwaProviders } = await sut.execute({})

    expect(manhwaProviders).toHaveLength(3)
    expect(manhwaProviders[0]).toEqual(
      expect.objectContaining({
        manhwaName: 'Manhwa A',
        providerName: 'Provider X',
      }),
    )
  })

  it('should be able to filter manhwa providers by manhwaId', async () => {
    await manhwaProviderRepository.create(
      { manhwaId: 1n, providerId: 1n },
      { name: 'Manhwa A' },
      { name: 'Provider X' },
    )
    await manhwaProviderRepository.create(
      { manhwaId: 1n, providerId: 2n },
      { name: 'Manhwa B' },
      { name: 'Provider Y' },
    )
    await manhwaProviderRepository.create(
      { manhwaId: 2n, providerId: 1n },
      { name: 'Manhwa C' },
      { name: 'Provider Z' },
    )

    const { manhwaProviders } = await sut.execute({ manhwaId: 1n })

    expect(manhwaProviders).toHaveLength(2)
    expect(manhwaProviders[0].manhwaId).toBe(1n)
    expect(manhwaProviders[1].manhwaId).toBe(1n)
  })

  it('should be able to filter manhwa providers by providerId', async () => {
    await manhwaProviderRepository.create(
      { manhwaId: 1n, providerId: 1n },
      { name: 'Manhwa A' },
      { name: 'Provider X' },
    )
    await manhwaProviderRepository.create(
      { manhwaId: 1n, providerId: 2n },
      { name: 'Manhwa B' },
      { name: 'Provider Y' },
    )
    await manhwaProviderRepository.create(
      { manhwaId: 2n, providerId: 1n },
      { name: 'Manhwa C' },
      { name: 'Provider Z' },
    )

    const { manhwaProviders } = await sut.execute({ providerId: 2n })

    expect(manhwaProviders).toHaveLength(1)
    expect(manhwaProviders[0].providerId).toBe(2n)
  })

  it('should be able to filter manhwa providers by manhwa name', async () => {
    await manhwaProviderRepository.create(
      { manhwaId: 1n, providerId: 1n },
      { name: 'Manhwa A' },
      { name: 'Provider X' },
    )
    await manhwaProviderRepository.create(
      { manhwaId: 2n, providerId: 2n },
      { name: 'Manhwa B' },
      { name: 'Provider Y' },
    )

    const { manhwaProviders } = await sut.execute({ manhwaName: 'Manhwa A' })

    expect(manhwaProviders).toHaveLength(1)
    expect(manhwaProviders[0].manhwaName).toBe('Manhwa A')
  })

  it('should be able to filter manhwa providers by provider name', async () => {
    await manhwaProviderRepository.create(
      { manhwaId: 1n, providerId: 1n },
      { name: 'Manhwa A' },
      { name: 'Provider X' },
    )
    await manhwaProviderRepository.create(
      { manhwaId: 2n, providerId: 2n },
      { name: 'Manhwa B' },
      { name: 'Provider Y' },
    )

    const { manhwaProviders } = await sut.execute({
      providerName: 'Provider X',
    })

    expect(manhwaProviders).toHaveLength(1)
    expect(manhwaProviders[0].providerName).toBe('Provider X')
  })
})
