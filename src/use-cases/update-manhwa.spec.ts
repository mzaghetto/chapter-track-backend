import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryManhwasRepository } from '@/repositories/in-memory/in-memory-manhwas-repository'
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
      id: 'manhwa-01',
      name: 'The Gamer',
      last_episode_released: 429,
      last_episode_notified: 428,
      available_read_url: ['Mangatop', 'MCReader', 'Neox'],
      manhwa_thumb: 'http://www.thum-qualquer.com',
      url_crawler: 'https://www.mangageko.com/manga/manga-1773/',
      users_to_notify: [],
    })
  })

  it('should be able to update a manhwa name', async () => {
    const data = {
      name: 'The Hero',
    }

    const { manhwa } = await sut.execute({
      manhwaID: 'manhwa-01',
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
        manhwaID: 'non-existing-id',
        data,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be able to update a last episode released', async () => {
    const data = {
      last_episode_released: 430,
    }

    const { manhwa } = await sut.execute({
      manhwaID: 'manhwa-01',
      data,
    })

    expect(manhwa.last_episode_released).toEqual(data.last_episode_released)
  })

  it('should be able to update a last episode notified', async () => {
    const data = {
      last_episode_notified: 429,
    }

    const { manhwa } = await sut.execute({
      manhwaID: 'manhwa-01',
      data,
    })

    expect(manhwa.last_episode_released).toEqual(data.last_episode_notified)
  })

  it('should not be possible to update a manhwa name with the same name as a registered manhwa', async () => {
    await manhwasRepository.create({
      id: 'manhwa-02',
      name: 'The Hero',
      last_episode_released: 429,
      last_episode_notified: 428,
      available_read_url: ['Mangatop', 'MCReader', 'Neox'],
      manhwa_thumb: 'http://www.thum-qualquer.com',
      url_crawler: 'https://www.mangageko.com/manga/manga-1773/',
      users_to_notify: [],
    })

    const data = {
      name: 'The Gamer',
    }

    await expect(() =>
      sut.execute({
        manhwaID: 'manhwa-02',
        data,
      }),
    ).rejects.toBeInstanceOf(ManhwaAlreadyExistsError)
  })
})
