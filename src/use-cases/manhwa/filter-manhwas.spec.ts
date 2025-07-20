import { expect, describe, it, beforeEach } from 'vitest'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
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
      id: BigInt(1),
      name: `Second Life Ranker`,
      author: 'Someone',
      genre: 'Fantasy',
      coverImage: 'http://example.com/cover.jpg',
      description: 'A cool story',
      status: 'ONGOING',
    })

    // create several manhwas to pagination
    for (let i = 2; i <= 23; i++) {
      await manhwasRepository.create({
        id: BigInt(i),
        name: `The Gamer ${i}`,
        author: 'Someone',
        genre: 'Fantasy',
        coverImage: 'http://example.com/cover.jpg',
        description: 'A cool story',
        status: 'ONGOING',
      })
    }
  })

  it('should be able to filter manhwa by name', async () => {
    const manhwas = await sut.execute({
      nameToFilter: 'Second',
      params,
    })

    expect(manhwas.items.length).toEqual(1)
    expect(manhwas.items[0].manhwaName).toEqual('Second Life Ranker')
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
