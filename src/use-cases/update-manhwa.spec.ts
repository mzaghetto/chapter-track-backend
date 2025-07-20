import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryManhwasRepository } from '@/repositories/in-memory/in-memory-manhwas-repository'
import { ManhwaStatus } from '@prisma/client'
import { UpdateManhwaUseCase } from './update-manhwa'
import { ManhwaAlreadyExistsError } from './errors/manhwa-already-exists-error'
import { ResourceNotFoundError } from './errors/resource-not-found'

let manhwasRepository: InMemoryManhwasRepository
let sut: UpdateManhwaUseCase

describe('Update Manhwa Use Case', () => {
  beforeEach(async () => {
    manhwasRepository = new InMemoryManhwasRepository()
    sut = new UpdateManhwaUseCase(manhwasRepository)

    await manhwasRepository.create({
      id: BigInt(1),
      name: 'The Gamer',
      author: 'Someone',
      genre: 'Fantasy',
      coverImage: 'http://example.com/cover.jpg',
      description: 'A cool story',
      status: 'ONGOING',
    })
  })

  it('should be able to update a manhwa name', async () => {
    const data = {
      name: 'The Hero',
    }

    const { manhwa } = await sut.execute({
      manhwaID: BigInt(1),
      data,
    })

    expect(manhwa.name).toEqual(data.name)
  })

  it('should not be able to update a manhwa with wrong id', async () => {
    const data = {
      name: 'The Hero',
    }

    await expect(() =>
      sut.execute({
        manhwaID: BigInt(99),
        data,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be able to update a last episode released', async () => {
    const data = {
      status: ManhwaStatus.COMPLETED,
    }

    const { manhwa } = await sut.execute({
      manhwaID: BigInt(1),
      data,
    })

    expect(manhwa.status).toEqual(data.status)
  })

  it('should not be possible to update a manhwa name with the same name as a registered manhwa', async () => {
    await manhwasRepository.create({
      id: BigInt(2),
      name: 'The Hero',
      author: 'Someone',
      genre: 'Fantasy',
      coverImage: 'http://example.com/cover.jpg',
      description: 'A cool story',
      status: 'ONGOING',
    })

    const data = {
      name: 'The Gamer',
    }

    await expect(() =>
      sut.execute({
        manhwaID: BigInt(2),
        data,
      }),
    ).rejects.toBeInstanceOf(ManhwaAlreadyExistsError)
  })
})
