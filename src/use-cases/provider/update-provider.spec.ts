import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryProvidersRepository } from '@/repositories/in-memory/in-memory-providers-repository'
import { UpdateProviderUseCase } from './update-provider'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'

let providersRepository: InMemoryProvidersRepository
let sut: UpdateProviderUseCase

describe('Update Provider Use Case', () => {
  beforeEach(async () => {
    providersRepository = new InMemoryProvidersRepository()
    sut = new UpdateProviderUseCase(providersRepository)

    await providersRepository.create({
      id: BigInt(1),
      name: 'MangaDex',
      url: 'https://mangadex.org',
      isActive: true,
    })
  })

  it('should be able to update a provider', async () => {
    const { provider } = await sut.execute({
      providerId: BigInt(1),
      data: {
        name: 'MangaDex Updated',
      },
    })

    expect(provider.name).toEqual('MangaDex Updated')
  })

  it('should not be able to update a non-existing provider', async () => {
    await expect(async () =>
      sut.execute({
        providerId: BigInt(99),
        data: {
          name: 'MangaDex Updated',
        },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
