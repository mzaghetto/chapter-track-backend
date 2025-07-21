import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GenerateTelegramLinkingTokenUseCase } from './generate-telegram-linking-token-use-case'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { hash } from 'bcryptjs'

let usersRepository: InMemoryUsersRepository
let sut: GenerateTelegramLinkingTokenUseCase

describe('Generate Telegram Linking Token Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GenerateTelegramLinkingTokenUseCase(usersRepository)
  })

  it('should be able to generate a telegram linking token for a user', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.telegramLinkingToken).toEqual(expect.any(String))
    expect(user.telegramLinkingToken).not.toBeNull()
  })

  it('should not be able to generate a token for a non-existing user', async () => {
    await expect(() =>
      sut.execute({
        userId: 999n,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
