import { expect, describe, it, beforeEach } from 'vitest'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { InMemoryManhwasRepository } from '@/repositories/in-memory/in-memory-manhwas-repository'
import { FilterManhwaByNameUseCase } from './filter-manhwas'
import { Page } from '@/lib/pageable'

let manhwasRepository: InMemoryManhwasRepository
let sut: FilterManhwaByNameUseCase
let params: Page

describe('Get Unread Manhwas Use Case', () => {
  beforeEach(async () => {
    manhwasRepository = new InMemoryManhwasRepository()
    sut = new FilterManhwaByNameUseCase(manhwasRepository)

    params = {}

    await manhwasRepository.create({
      id: `manhwa-01`,
      name: `Second Life Ranker`,
      last_episode_released: 2,
      last_episode_notified: 1,
      available_read_url: ['Mangatop', 'MCReader', 'Neox'],
      manhwa_thumb: 'http://www.thum-qualquer.com',
      url_crawler: 'https://www.mangageko.com/manga/manga-1773/',
      users_to_notify: [],
    })

    // create several manhwas to pagination
    for (let i = 1; i <= 22; i++) {
      await manhwasRepository.create({
        id: `manhwa-${i}`,
        name: `The Gamer ${i}`,
        last_episode_released: 2,
        last_episode_notified: 1,
        available_read_url: ['Mangatop', 'MCReader', 'Neox'],
        manhwa_thumb: 'http://www.thum-qualquer.com',
        url_crawler: 'https://www.mangageko.com/manga/manga-1773/',
        users_to_notify: [],
      })
    }
  })

  it('should be able to filter manhwa by name', async () => {
    const manhwas = await sut.execute({
      nameToFilter: 'Second',
      params,
    })

    expect(manhwas.items.length).toEqual(1)
    expect.objectContaining({
      manhwaName: 'Second Life Ranker',
    })
  })

  it('should be able to pass a limit for create a pagination', async () => {
    params.limit = 2

    const manhwas = await sut.execute({
      nameToFilter: 'The Gamer',
      params,
    })

    expect(manhwas.totalPages).toBeGreaterThan(1)
    expect(manhwas.totalItemsPage).toBe(2)
  })

  it('should be able to pass navigate in pages', async () => {
    params.limit = 2
    params.page = 2

    const manhwas = await sut.execute({
      nameToFilter: 'The Gamer',
      params,
    })

    expect(manhwas.totalPages).toBeGreaterThan(1)
    expect(manhwas.currentPage).toBe(2)
  })

  it('should not be able to get manhwas that name do not exists', async () => {
    await expect(() =>
      sut.execute({
        nameToFilter: 'manhwa-not-exists',
        params,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
