import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryManhwasRepository } from '@/repositories/in-memory/in-memory-manhwas-repository'
import { RegisterManhwaUseCase } from './register-manhwa'
import { ManhwaAlreadyExistsError } from './errors/manhwa-already-exists-error'

let manhwaRepository: InMemoryManhwasRepository
let sut: RegisterManhwaUseCase

describe('Register Manhwa Use Case', () => {
  beforeEach(() => {
    manhwaRepository = new InMemoryManhwasRepository()
    sut = new RegisterManhwaUseCase(manhwaRepository)
  })

  it('should be able to register a new manhwa', async () => {
    const { manhwa } = await sut.execute({
      name: 'The Gamer',
      author: 'Someone',
      genre: 'Fantasy',
      coverImage: 'http://example.com/cover.jpg',
      description: 'A cool story',
      status: 'ONGOING',
    })

    expect(manhwa.id).toEqual(expect.any(BigInt))
  })

  it('should not be able to register a new manhwa with the same name', async () => {
    const name = 'The gamer'

    await sut.execute({
      name,
      author: 'Someone',
      genre: 'Fantasy',
      coverImage: 'http://example.com/cover.jpg',
      description: 'A cool story',
      status: 'ONGOING',
    })

    await expect(() =>
      sut.execute({
        name,
        author: 'Someone',
        genre: 'Fantasy',
        coverImage: 'http://example.com/cover.jpg',
        description: 'A cool story',
        status: 'ONGOING',
      }),
    ).rejects.toBeInstanceOf(ManhwaAlreadyExistsError)
  })
})
