import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UpdateUserProfileUseCase } from './update-user-profile'
import { RoleUpdateError } from './errors/role-update-error'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error'
import { UsernameAlreadyExistsError } from './errors/username-already-exists-error'
import { randomUUID } from 'crypto'
import { ResourceNotFoundError } from './errors/resource-not-found'

let usersRepository: InMemoryUsersRepository
let sut: UpdateUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new UpdateUserProfileUseCase(usersRepository)
  })

  it('should be able to update user profile', async () => {
    const createdUser = await usersRepository.create({
      id: randomUUID(),
      name: 'Jhon Doe',
      username: 'jhondoe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      role: 'user',
      created_at: new Date(),
      updated_at: null,
    })

    const data = {
      name: 'Jhon Doeeeeeeee',
    }

    const { user } = await sut.execute({
      userID: createdUser.id,
      data,
    })

    expect(user.name).toEqual('Jhon Doeeeeeeee')
  })

  it('should not be able to update a user profile with wrong id', async () => {
    await usersRepository.create({
      id: randomUUID(),
      name: 'Jhon Doe',
      username: 'jhondoe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      role: 'user',
      created_at: new Date(),
      updated_at: null,
    })

    const data = {
      name: 'Jhon Doeeeeeeee',
    }

    await expect(() =>
      sut.execute({
        userID: 'non-existing-id',
        data,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to update user role in user profile', async () => {
    const createdUser = await usersRepository.create({
      id: randomUUID(),
      name: 'Jhon Doe',
      username: 'jhondoe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      role: 'user',
      created_at: new Date(),
      updated_at: null,
    })

    const data = {
      role: 'admin',
    }

    await expect(() =>
      sut.execute({
        userID: createdUser.id,
        data,
      }),
    ).rejects.toBeInstanceOf(RoleUpdateError)
  })

  it('should not be able to update to an email address that has already been registered by another user', async () => {
    await usersRepository.create({
      id: randomUUID(),
      name: 'Jhon Doe',
      username: 'jhondoe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      role: 'user',
      created_at: new Date(),
      updated_at: null,
    })

    const createdUser = await usersRepository.create({
      id: randomUUID(),
      name: 'Jhon Doe 2',
      username: 'jhondoe2',
      email: 'johndoe2@example.com',
      password_hash: await hash('123456', 6),
      role: 'user',
      created_at: new Date(),
      updated_at: null,
    })

    const data = {
      email: 'johndoe@example.com',
    }

    await expect(() =>
      sut.execute({
        userID: createdUser.id,
        data,
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError)
  })

  it('should not be able to update to an username that has already been registered by another user', async () => {
    await usersRepository.create({
      id: randomUUID(),
      name: 'Jhon Doe',
      username: 'jhondoe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      role: 'user',
      created_at: new Date(),
      updated_at: null,
    })

    const createdUser = await usersRepository.create({
      id: randomUUID(),
      name: 'Jhon Doe 2',
      username: 'jhondoe2',
      email: 'johndoe2@example.com',
      password_hash: await hash('123456', 6),
      role: 'user',
      created_at: new Date(),
      updated_at: null,
    })

    const data = {
      username: 'jhondoe',
    }

    await expect(() =>
      sut.execute({
        userID: createdUser.id,
        data,
      }),
    ).rejects.toBeInstanceOf(UsernameAlreadyExistsError)
  })
})
