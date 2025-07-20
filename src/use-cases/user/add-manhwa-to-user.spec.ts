import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUserManhwaRepository } from '@/repositories/in-memory/in-memory-user-manhwa-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { InMemoryProvidersRepository } from '@/repositories/in-memory/in-memory-providers-repository'
import { AddManhwaToUserUseCase } from './add-manhwa-to-user'
import { InMemoryManhwasRepository } from '@/repositories/in-memory/in-memory-manhwas-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { ManhwaAlreadyExistsError } from '@/use-cases/errors/manhwa-already-exists-error'

let usersRepository: InMemoryUsersRepository
let userManhwaRepository: InMemoryUserManhwaRepository
let manhwasRepository: InMemoryManhwasRepository
let providersRepository: InMemoryProvidersRepository
let sut: AddManhwaToUserUseCase

describe('Add Manhwa to User Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    userManhwaRepository = new InMemoryUserManhwaRepository()
    manhwasRepository = new InMemoryManhwasRepository()
    providersRepository = new InMemoryProvidersRepository()
    sut = new AddManhwaToUserUseCase(
      userManhwaRepository,
      manhwasRepository,
      providersRepository,
      usersRepository,
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
      name: 'The Hero 03',
      author: 'Someone',
      genre: 'Fantasy',
      coverImage: 'http://example.com/cover.jpg',
      description: 'A cool story',
      status: 'ONGOING',
    })
  })

  it('should be able to add a manhwa in user manhwa', async () => {
    const { userManhwa } = await sut.execute({
      userId: BigInt(1),
      manhwaId: BigInt(1),
      order: 0,
    })

    expect(userManhwa.manhwaId).toEqual(BigInt(1))
  })

  it('should not be able to add a manhwa in a non-existent user to user manhwa', async () => {
    await expect(() =>
      sut.execute({
        userId: BigInt(99),
        manhwaId: BigInt(1),
        order: 0,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to add a manhwa with a non-existent manhwa to user manhwa', async () => {
    await expect(() =>
      sut.execute({
        userId: BigInt(1),
        manhwaId: BigInt(99),
        order: 0,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to add a manhwa that has already been registered in manhwa to user manhwa', async () => {
    await sut.execute({
      userId: BigInt(1),
      manhwaId: BigInt(1),
      order: 0,
    })

    await expect(() =>
      sut.execute({
        userId: BigInt(1),
        manhwaId: BigInt(1),
        order: 0,
      }),
    ).rejects.toBeInstanceOf(ManhwaAlreadyExistsError)
  })

  it('should be auto increment the position of the manhwa in user manhwa', async () => {
    await sut.execute({
      userId: BigInt(1),
      manhwaId: BigInt(1),
      order: 0,
    })

    await sut.execute({
      userId: BigInt(1),
      manhwaId: BigInt(2),
      order: 1,
    })

    const { userManhwa } = await sut.execute({
      userId: BigInt(1),
      manhwaId: BigInt(3),
      order: 2,
    })

    expect(userManhwa.order).toEqual(2)
  })
})
