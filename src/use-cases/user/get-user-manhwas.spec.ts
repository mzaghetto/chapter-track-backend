import { expect, describe, it, beforeEach } from 'vitest'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { InMemoryUserManhwaRepository } from '@/repositories/in-memory/in-memory-user-manhwa-repository'
import { InMemoryManhwasRepository } from '@/repositories/in-memory/in-memory-manhwas-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { GetUserManhwasUseCase } from './get-user-manhwas'

let usersRepository: InMemoryUsersRepository
let userManhwaRepository: InMemoryUserManhwaRepository
let manhwasRepository: InMemoryManhwasRepository
let sut: GetUserManhwasUseCase

describe('Get User Manhwas Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    userManhwaRepository = new InMemoryUserManhwaRepository()
    manhwasRepository = new InMemoryManhwasRepository()
    sut = new GetUserManhwasUseCase(userManhwaRepository, usersRepository)

    await usersRepository.create({
      id: BigInt(1),
      name: 'Jhon Doe',
      username: 'jhondoe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      role: 'USER',
      createdAt: new Date(),
    })

    // create several manhwas to pagination
    for (let i = 1; i <= 22; i++) {
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

    // add several manhwas to pagination
    for (let i = 1; i <= 22; i++) {
      await userManhwaRepository.create({
        userId: BigInt(1),
        manhwaId: BigInt(i),
        order: i - 1,
        lastEpisodeRead: 0,
        status: 'READING',
      })
    }
  })

  it('should be able to get all manhwas of user profile', async () => {
    const { userManhwas } = await sut.execute({
      userId: BigInt(1),
      page: 1,
      pageSize: 20,
    })

    expect(userManhwas.length).toEqual(20)
  })

  it('should be able to get page 2 manhwas of user profile', async () => {
    const { userManhwas } = await sut.execute({
      userId: BigInt(1),
      page: 2,
      pageSize: 20,
    })

    expect(userManhwas[0].manhwaId).toEqual(BigInt(21))
  })

  it('should be able to get manhwas of a user without page in body request', async () => {
    const { userManhwas } = await sut.execute({
      userId: BigInt(1),
      page: 1,
      pageSize: 20,
    })

    expect(userManhwas.length).toEqual(20)
  })

  it('should not be able to get manhwas of user profile with wrong id', async () => {
    await expect(async () =>
      sut.execute({
        userId: BigInt(999),
        page: 1,
        pageSize: 20,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
