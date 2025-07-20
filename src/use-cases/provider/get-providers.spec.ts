import { InMemoryProvidersRepository } from '@/repositories/in-memory/in-memory-providers-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetProvidersUseCase } from './get-providers'

describe('Get Providers Use Case', () => {
  let providersRepository: InMemoryProvidersRepository
  let sut: GetProvidersUseCase

  beforeEach(() => {
    providersRepository = new InMemoryProvidersRepository()
    sut = new GetProvidersUseCase(providersRepository)
  })

  it('should be able to get a list of providers', async () => {
    await providersRepository.create({
      name: 'Provider 1',
      url: 'http://provider1.com',
    })
    await providersRepository.create({
      name: 'Provider 2',
      url: 'http://provider2.com',
    })

    const { providers } = await sut.execute()

    expect(providers).toHaveLength(2)
    expect(providers[0].name).toBe('Provider 1')
    expect(providers[1].name).toBe('Provider 2')
  })
})
