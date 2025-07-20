import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryProvidersRepository } from '@/repositories/in-memory/in-memory-providers-repository'
import { CreateProviderUseCase } from './create-provider'

let providersRepository: InMemoryProvidersRepository
let sut: CreateProviderUseCase

describe('Create Provider Use Case', () => {
  beforeEach(() => {
    providersRepository = new InMemoryProvidersRepository()
    sut = new CreateProviderUseCase(providersRepository)
  })

  it('should be able to create a new provider', async () => {
    const { provider } = await sut.execute({
      name: 'MangaDex',
      url: 'https://mangadex.org',
    })

    expect(provider.id).toEqual(expect.any(BigInt))
    expect(provider.name).toEqual('MangaDex')
  })
})
