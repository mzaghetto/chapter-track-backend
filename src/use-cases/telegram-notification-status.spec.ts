import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { TelegramNotificationUseCase } from './telegram-notification-status'
import { hash } from 'bcryptjs'
import { TelegramIDRequired } from './errors/telegram-id-required'
import { ResourceNotFoundError } from './errors/resource-not-found'

let usersRepository: InMemoryUsersRepository
let sut: TelegramNotificationUseCase

describe('Telegram Notification Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new TelegramNotificationUseCase(usersRepository)

    await usersRepository.create({
      id: 1n,
      name: 'Jhon Doe',
      username: 'jhondoe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      role: 'USER',
      createdAt: new Date(),
      
      telegramId: null,
      telegramActive: false,
    })
  })

  it('should be able to activate telegram notification', async () => {
    const { activate } = await sut.execute({
      userId: 1n,
      telegramId: 'telegramId-1234',
      activate: true,
    })

    expect(activate).toEqual(true)
  })

  it('should be able to deactivate telegram notification', async () => {
    await sut.execute({
      userId: 1n,
      telegramId: 'telegramId-1234',
      activate: true,
    })

    const { activate } = await sut.execute({
      userId: 1n,
      telegramId: 'telegramId-1234',
      activate: false,
    })

    expect(activate).toEqual(false)
  })

  it('should not be able to activate/deactive telegram notification with a incorrect userID', async () => {
    await expect(async () =>
      sut.execute({
        userId: 999n,
        activate: true,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)

    await expect(async () =>
      sut.execute({
        userId: 999n,
        activate: false,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to activate telegram notification without telegramID when user not has a telegramID', async () => {
    await expect(() =>
      sut.execute({
        userId: 1n,
        activate: true,
      }),
    ).rejects.toBeInstanceOf(TelegramIDRequired)
  })
})
