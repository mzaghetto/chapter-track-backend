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
      last_episode_released: 429,
      last_episode_notified: 428,
      available_read_url: ['Mangatop', 'MCReader', 'Neox'],
      manhwa_thumb: 'http://www.thum-qualquer.com',
      url_crawler: 'https://www.mangageko.com/manga/manga-1773/',
      users_to_notify: [],
    })

    expect(manhwa.id).toEqual(expect.any(String))
  })

  it('should not be able to register a new manhwa with the same name', async () => {
    const name = 'The gamer'

    await sut.execute({
      name,
      last_episode_released: 429,
      last_episode_notified: 428,
      available_read_url: ['Mangatop', 'MCReader', 'Neox'],
      manhwa_thumb: 'http://www.thum-qualquer.com',
      url_crawler: 'https://www.mangageko.com/manga/manga-1773/',
      users_to_notify: [],
    })

    await expect(() =>
      sut.execute({
        name,
        last_episode_released: 429,
        last_episode_notified: 428,
        available_read_url: ['Mangatop', 'MCReader', 'Neox'],
        manhwa_thumb: 'http://www.thum-qualquer.com',
        url_crawler: 'https://www.mangageko.com/manga/manga-1773/',
        users_to_notify: [],
      }),
    ).rejects.toBeInstanceOf(ManhwaAlreadyExistsError)
  })
})
