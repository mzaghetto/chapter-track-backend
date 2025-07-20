import { expect, describe, it, beforeEach } from 'vitest'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { InMemoryUserManhwaRepository } from '@/repositories/in-memory/in-memory-user-manhwa-repository'
import { InMemoryManhwasRepository } from '@/repositories/in-memory/in-memory-manhwas-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { GetUnreadManhwasUseCase } from './get-unread-manhwas'

import { InMemoryProvidersRepository } from '@/repositories/in-memory/in-memory-providers-repository'
import { InMemoryManhwaProviderRepository } from '@/repositories/in-memory/in-memory-manhwa-provider-repository'

let usersRepository: InMemoryUsersRepository
let userManhwaRepository: InMemoryUserManhwaRepository
let manhwasRepository: InMemoryManhwasRepository
let providersRepository: InMemoryProvidersRepository
let manhwaProviderRepository: InMemoryManhwaProviderRepository
let sut: GetUnreadManhwasUseCase

describe('Get Unread Manhwas Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    userManhwaRepository = new InMemoryUserManhwaRepository()
    providersRepository = new InMemoryProvidersRepository()
    manhwaProviderRepository = new InMemoryManhwaProviderRepository()
    manhwasRepository = new InMemoryManhwasRepository(manhwaProviderRepository)
    sut = new GetUnreadManhwasUseCase(userManhwaRepository, manhwasRepository)

    await usersRepository.create({
      id: 1n,
      name: 'Jhon Doe',
      username: 'jhondoe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      role: 'USER',
      createdAt: new Date(),
    })

    await providersRepository.create({
      id: 1n,
      name: 'Provider 1',
      url: 'http://provider1.com',
    })

    // create several manhwas
    for (let i = 1; i <= 22; i++) {
      const manhwaProvider = await manhwaProviderRepository.create({
        manhwaId: BigInt(i),
        providerId: 1n,
        lastEpisodeReleased: 2,
        url: `http://provider1.com/manhwa`,
      })

      await manhwasRepository.create({
        id: BigInt(i),
        name: `The Gamer ${i}`,
        author: 'Author',
        genre: ['Action'],
        coverImage: 'http://example.com/cover.jpg',
        description: 'Description',
        status: 'ONGOING',
        manhwaProviders: [manhwaProvider],
      })
    }
  })

  it('should be able to get all unread manhwas of user', async () => {
    await userManhwaRepository.create({
      userId: 1n,
      manhwaId: 3n,
      order: 0,
      lastEpisodeRead: 1,
      status: 'READING',
    })

    await userManhwaRepository.create({
      userId: 1n,
      manhwaId: 12n,
      order: 1,
      lastEpisodeRead: 1,
      status: 'READING',
    })

    await userManhwaRepository.create({
      userId: 1n,
      manhwaId: 20n,
      order: 2,
      lastEpisodeRead: 2,
      status: 'READING',
    })

    const { unreadManhwas } = await sut.execute({
      userId: 1n,
    })

    expect(unreadManhwas.length).toEqual(2)
    expect(unreadManhwas).toEqual([
      expect.objectContaining({
        manhwaId: 3n,
        lastEpisodeRead: 1,
        lastEpisodeReleased: 2,
      }),
      expect.objectContaining({
        manhwaId: 12n,
        lastEpisodeRead: 1,
        lastEpisodeReleased: 2,
      }),
    ])
  })

  it('should not be able to get unread manhwas if user do not exists', async () => {
    await expect(() =>
      sut.execute({
        userId: 999n,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
