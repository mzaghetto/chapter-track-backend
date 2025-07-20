import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUserManhwaRepository } from '@/repositories/in-memory/in-memory-user-manhwa-repository'
import { InMemoryManhwasRepository } from '@/repositories/in-memory/in-memory-manhwas-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { OrganizeManhwasUseCase } from './organize-manhwas'
import { ManhwaPositionNegativeError } from './errors/manhwa-position-negative-error'
import { ManhwaPositionBreakOrderError } from './errors/manhwa-position-break-order-error'
import { ManhwaPositionAlreadyTakenError } from './errors/manhwa-position-already-taken-error'
import { InvalidManhwaIdError } from './errors/invalid-manhwa-id-error'
import { ResourceNotFoundError } from './errors/resource-not-found'

let usersRepository: InMemoryUsersRepository
let userManhwaRepository: InMemoryUserManhwaRepository
let manhwasRepository: InMemoryManhwasRepository
let sut: OrganizeManhwasUseCase

describe('Organize Manhwa Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    userManhwaRepository = new InMemoryUserManhwaRepository()
    manhwasRepository = new InMemoryManhwasRepository()
    sut = new OrganizeManhwasUseCase(userManhwaRepository)

    await usersRepository.create({
      id: 1n,
      name: 'Jhon Doe',
      username: 'jhondoe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      role: 'USER',
      createdAt: new Date(),
    })

    // No need to create a userManhwa here, it will be created in the test itself

    // create several manhwas to pagination
    for (let i = 0; i <= 22; i++) {
      await manhwasRepository.create({
        id: BigInt(i),
        name: `The Gamer ${i}`,
        status: 'ONGOING',
      })
    }

    // add several manhwas to pagination
    for (let i = 0; i <= 22; i++) {
      await userManhwaRepository.create({
        userId: 1n,
        manhwaId: BigInt(i + 1),
        order: i,
        lastEpisodeRead: 0,
        status: 'READING',
      })
    }
  })

  it('should be able to organize the list os manhwas', async () => {
    await userManhwaRepository.create({
      userId: 1n,
      manhwaId: 2n,
      order: 0,
      lastEpisodeRead: 0,
      status: 'READING',
    })
    await userManhwaRepository.create({
      userId: 1n,
      manhwaId: 1n,
      order: 1,
      lastEpisodeRead: 0,
      status: 'READING',
    })
    await userManhwaRepository.create({
      userId: 1n,
      manhwaId: 0n,
      order: 2,
      lastEpisodeRead: 0,
      status: 'READING',
    })
    await userManhwaRepository.create({
      userId: 1n,
      manhwaId: 12n,
      order: 13,
      lastEpisodeRead: 0,
      status: 'READING',
    })
    await userManhwaRepository.create({
      userId: 1n,
      manhwaId: 13n,
      order: 12,
      lastEpisodeRead: 0,
      status: 'READING',
    })

    const manhwaOrders = [
      { manhwaId: 2n, order: 0 },
      { manhwaId: 1n, order: 1 },
      { manhwaId: 0n, order: 2 },
      { manhwaId: 12n, order: 13 },
      { manhwaId: 13n, order: 12 },
    ]

    await expect(sut.execute({
      userId: 1n,
      manhwaOrders,
    })).rejects.toBeInstanceOf(ManhwaPositionBreakOrderError)
  })

  it('should not be able to send with user id invalid', async () => {
    const manhwaOrders = [
      { manhwaId: 1n, order: 1 },
      { manhwaId: 2n, order: 2 },
      { manhwaId: 3n, order: 3 },
    ]

    await expect(async () =>
      sut.execute({
        userId: 999n,
        manhwaOrders,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to send the manhwa id invalid', async () => {
    const manhwaOrders = [
      { manhwaId: 1n, order: 1 },
      { manhwaId: 2n, order: 2 },
      { manhwaId: 99n, order: 3 },
    ]

    await expect(
      sut.execute({
        userId: 1n,
        manhwaOrders,
      }),
    ).rejects.toBeInstanceOf(InvalidManhwaIdError)
  })

  it('should not be able to send the manhwa position negative', async () => {
    const manhwaOrders = [
      { manhwaId: 3n, order: -2 },
      { manhwaId: 2n, order: 25 },
      { manhwaId: 1n, order: 1 },
    ]

    await expect(
      sut.execute({
        userId: 1n,
        manhwaOrders,
      }),
    ).rejects.toBeInstanceOf(ManhwaPositionNegativeError)
  })

  it('should not be able to send the manhwa position that breaks the order', async () => {
    const manhwaOrders = [
      { manhwaId: 4n, order: 1 },
      { manhwaId: 3n, order: 2 },
      { manhwaId: 2n, order: 4 },
    ]

    await expect(
      sut.execute({
        userId: 1n,
        manhwaOrders,
      }),
    ).rejects.toBeInstanceOf(ManhwaPositionBreakOrderError)
  })

  it('should not be able to send the manhwa position twice', async () => {
    const manhwaOrders = [
      { manhwaId: 2n, order: 1 },
      { manhwaId: 3n, order: 2 },
      { manhwaId: 23n, order: 2 },
    ]

    await expect(
      sut.execute({
        userId: 1n,
        manhwaOrders,
      }),
    ).rejects.toBeInstanceOf(ManhwaPositionAlreadyTakenError)
  })
})
