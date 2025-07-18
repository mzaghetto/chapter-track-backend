import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUserUseCase } from './register-user'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error'
import { UsernameAlreadyExistsError } from './errors/username-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUserUseCase

describe('Register User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUserUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'Jhon Doe',
      email: 'johndoe@example.com',
      password: '123456',
      username: 'jhondoe',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon register', async () => {
    const { user } = await sut.execute({
      name: 'Jhon Doe',
      email: 'johndoe@example.com',
      password: '123456',
      username: 'jhondoe',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash!,
    )

    expect(user.password_hash).toBeTruthy()
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'johndoe@example.com'

    await sut.execute({
      name: 'Jhon Doe',
      email,
      password: '123456',
      username: 'jhondoe',
    })

    await expect(() =>
      sut.execute({
        name: 'Jhon Doe',
        email,
        password: '123456',
        username: 'jhondoe',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError)
  })

  it('should not be able to register with same username that has already been registered by another user', async () => {
    const username = 'johndoe'

    await sut.execute({
      name: 'Jhon Doe',
      email: 'johndoe@example.com',
      password: '123456',
      username,
    })

    await expect(() =>
      sut.execute({
        name: 'Jhon Doe2',
        email: 'johndoe2@example.com',
        password: '123456',
        username,
      }),
    ).rejects.toBeInstanceOf(UsernameAlreadyExistsError)
  })
})
