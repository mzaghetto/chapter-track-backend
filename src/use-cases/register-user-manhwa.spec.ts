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
      id: 'user-01',
      name: 'Jhon Doe',
      username: 'jhondoe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      role: 'user',
      created_at: new Date(),
      updated_at: null,
    })
  })

  it('should be able to register a user manhwa', async () => {
    const { userManhwa } = await sut.execute({
      user_id: 'user-01',
      manhwas: [],
      telegram_id: null,
    })

    expect(userManhwa.user_id).toEqual('user-01')
  })

  it('should not be able to register a user manhwa for a user if a valid user is not assigned.', async () => {
    await expect(() =>
      sut.execute({
        user_id: '123',
        manhwas: [],
        telegram_id: null,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
