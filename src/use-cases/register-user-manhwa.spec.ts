import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUserManhwaRepository } from '@/repositories/in-memory/in-memory-user-manhwa-repository'
import { RegisterUserManhwaUseCase } from './register-user-manhwa'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from './errors/resource-not-found'

let usersRepository: InMemoryUsersRepository
let userManhwaRepository: InMemoryUserManhwaRepository
let sut: RegisterUserManhwaUseCase

describe('Register User Manhwa Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    userManhwaRepository = new InMemoryUserManhwaRepository()
    sut = new RegisterUserManhwaUseCase(userManhwaRepository, usersRepository)

    await usersRepository.create({
      id: BigInt(1),
      name: 'Jhon Doe',
      username: 'jhondoe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      role: 'USER',
      createdAt: new Date(),
      
    })
  })

  it('should be able to register a user manhwa', async () => {
    const { userManhwa } = await sut.execute({
      userId: BigInt(1),
      manhwaId: BigInt(1),
      order: 1,
    })

    expect(userManhwa.userId).toEqual(BigInt(1))
  })

  it('should not be able to register a user manhwa for a user if a valid user is not assigned.', async () => {
    await expect(() =>
      sut.execute({
        userId: BigInt(99),
        manhwaId: BigInt(1),
        order: 1,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
