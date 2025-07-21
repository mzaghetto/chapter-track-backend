import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UpdateUserProfileUseCase } from './update-user-profile'
import { RoleUpdateError } from '@/use-cases/errors/role-update-error'
import { EmailAlreadyExistsError } from '@/use-cases/errors/email-already-exists-error'
import { UsernameAlreadyExistsError } from '@/use-cases/errors/username-already-exists-error'
import { Role } from '@prisma/client'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'

let usersRepository: InMemoryUsersRepository
let sut: UpdateUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new UpdateUserProfileUseCase(usersRepository)

    await usersRepository.create({
      id: BigInt(1),
      name: 'Jhon Doe',
      username: 'jhondoe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      role: 'USER',
      createdAt: new Date(),
      telegramLinkingToken: null,
    })
  })

  it('should be able to update user profile', async () => {
    const data = {
      name: 'Jhon Doeeeeeeee',
    }

    const { user } = await sut.execute({
      userID: BigInt(1),
      data,
    })

    expect(user.name).toEqual('Jhon Doeeeeeeee')
  })

  it('should be able to update telegramLinkingToken', async () => {
    const data = {
      telegramLinkingToken: 'some-new-token',
    }

    const { user } = await sut.execute({
      userID: BigInt(1),
      data,
    })

    expect(user.telegramLinkingToken).toEqual('some-new-token')
  })

  it('should not be able to update a user profile with wrong id', async () => {
    const data = {
      name: 'Jhon Doeeeeeeee',
    }

    await expect(() =>
      sut.execute({
        userID: BigInt(999),
        data,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to update user role in user profile', async () => {
    const data = {
      role: Role.ADMIN,
    }

    await expect(() =>
      sut.execute({
        userID: BigInt(1),
        data,
      }),
    ).rejects.toBeInstanceOf(RoleUpdateError)
  })

  it('should not be able to update to an email address that has already been registered by another user', async () => {
    const createdUser = await usersRepository.create({
      id: BigInt(2),
      name: 'Jhon Doe 2',
      username: 'jhondoe2',
      email: 'johndoe2@example.com',
      password_hash: await hash('123456', 6),
      role: 'USER',
      createdAt: new Date(),
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
    const createdUser = await usersRepository.create({
      id: BigInt(3),
      name: 'Jhon Doe 2',
      username: 'jhondoe2',
      email: 'johndoe2@example.com',
      password_hash: await hash('123456', 6),
      role: 'USER',
      createdAt: new Date(),
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
