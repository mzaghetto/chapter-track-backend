import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUserManhwaRepository } from '@/repositories/in-memory/in-memory-user-manhwa-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { InMemoryManhwasRepository } from '@/repositories/in-memory/in-memory-manhwas-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { RemoveManhwaFromUserUseCase } from './remove-manhwa-from-user'

let usersRepository: InMemoryUsersRepository
let userManhwaRepository: InMemoryUserManhwaRepository
let manhwasRepository: InMemoryManhwasRepository
let sut: RemoveManhwaFromUserUseCase

describe('Remove Manhwa from User Manhwa Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    userManhwaRepository = new InMemoryUserManhwaRepository()
    manhwasRepository = new InMemoryManhwasRepository()
    sut = new RemoveManhwaFromUserUseCase(
      userManhwaRepository,
    )

    await usersRepository.create({
      id: BigInt(1),
      name: 'Jhon Doe',
      username: 'jhondoe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      role: 'USER',
      createdAt: new Date(),
      
    })

    await manhwasRepository.create({
      id: BigInt(1),
      name: 'The Gamer',
      author: 'Someone',
      genre: 'Fantasy',
      coverImage: 'http://example.com/cover.jpg',
      description: 'A cool story',
      status: 'ONGOING',
    })

    await manhwasRepository.create({
      id: BigInt(2),
      name: 'The Hero',
      author: 'Someone',
      genre: 'Fantasy',
      coverImage: 'http://example.com/cover.jpg',
      description: 'A cool story',
      status: 'ONGOING',
    })

    await manhwasRepository.create({
      id: BigInt(3),
      name: 'The Baka',
      author: 'Someone',
      genre: 'Fantasy',
      coverImage: 'http://example.com/cover.jpg',
      description: 'A cool story',
      status: 'ONGOING',
    })

    await userManhwaRepository.create({
      userId: BigInt(1),
      manhwaId: BigInt(1),
      order: 0,
      status: 'READING',
    })

    await userManhwaRepository.create({
      userId: BigInt(1),
      manhwaId: BigInt(2),
      order: 1,
      status: 'READING',
    })

    await userManhwaRepository.create({
      userId: BigInt(1),
      manhwaId: BigInt(3),
      order: 2,
      status: 'READING',
    })
  })

  it('should be able to remove a manhwa from a user in user manhwa', async () => {
    await sut.execute({
      userId: BigInt(1),
      manhwaId: BigInt(1),
    })

    expect(userManhwaRepository.items.length).toEqual(2)
    expect(userManhwaRepository.items[0].manhwaId).toEqual(BigInt(2))
  })

  it('should not be able to remove a manhwa from a user in user manhwa with a invalid userID', async () => {
    await expect(() =>
      sut.execute({
        userId: BigInt(99),
        manhwaId: BigInt(1),
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to remove a manhwa not registered in user manhwa', async () => {
    await sut.execute({
      userId: BigInt(1),
      manhwaId: BigInt(3),
    })

    await expect(() =>
      sut.execute({
        userId: BigInt(1),
        manhwaId: BigInt(3),
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to remove a manhwa from a user in user manhwa with a invalid manhwaID', async () => {
    await expect(() =>
      sut.execute({
        userId: BigInt(1),
        manhwaId: BigInt(999),
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})