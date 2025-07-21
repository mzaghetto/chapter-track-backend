import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FindUserByTelegramLinkingTokenUseCase } from './find-user-by-telegram-linking-token-use-case'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { hash } from 'bcryptjs'

let usersRepository: InMemoryUsersRepository
let sut: FindUserByTelegramLinkingTokenUseCase

describe('Find User By Telegram Linking Token Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new FindUserByTelegramLinkingTokenUseCase(usersRepository)
  })

  it('should be able to find a user by telegram linking token', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      telegramLinkingToken: 'some-unique-token',
    })

    const { user } = await sut.execute({
      token: 'some-unique-token',
    })

    expect(user.id).toEqual(createdUser.id)
  })

  it('should not be able to find a user with a non-existing token', async () => {
    await expect(() =>
      sut.execute({
        token: 'non-existing-token',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
