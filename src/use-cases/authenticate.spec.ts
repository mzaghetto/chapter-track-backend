import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { makeUser } from './test/make-user'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    const userData = makeUser({
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })
    await usersRepository.create(userData)

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    const userData = makeUser()
    await usersRepository.create(userData)

    await expect(() =>
      sut.execute({
        email: 'johndoe1@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const user = makeUser({
      email: 'johndoe@example.com',
    })
    await usersRepository.create(user)

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate without a password hash', async () => {
    const user = makeUser({
      email: 'johndoe@example.com',
      password_hash: undefined,
    })
    await usersRepository.create(user)

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
