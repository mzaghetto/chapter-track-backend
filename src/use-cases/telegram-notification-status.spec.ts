import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUserManhwaRepository } from '@/repositories/in-memory/in-memory-user-manhwa-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { TelegramNotificationUseCase } from './telegram-notification-status'
import { TelegramIDRequired } from './errors/telegram-id-required'
import { ResourceNotFoundError } from './errors/resource-not-found'

let usersRepository: InMemoryUsersRepository
let userManhwaRepository: InMemoryUserManhwaRepository
let sut: TelegramNotificationUseCase

describe('Get Unread Manhwas Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    userManhwaRepository = new InMemoryUserManhwaRepository()
    sut = new TelegramNotificationUseCase(userManhwaRepository)

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

    await userManhwaRepository.create({
      id: 'user-manhwa-01',
      user_id: 'user-01',
      manhwas: [],
      telegram_id: null,
      telegram_active: false,
    })
  })

  it('should be able to activate telegram notification', async () => {
    const { activate } = await sut.execute({
      userID: 'user-01',
      telegramID: 'telegramId-1234',
      activate: true,
    })

    expect(activate).toEqual(true)
  })

  it('should be able to deactivate telegram notification', async () => {
    await sut.execute({
      userID: 'user-01',
      telegramID: 'telegramId-1234',
      activate: true,
    })

    const { activate } = await sut.execute({
      userID: 'user-01',
      telegramID: 'telegramId-1234',
      activate: false,
    })

    expect(activate).toEqual(false)
  })

  it('should not be able to activate/deactive telegram notification with a incorrect userID', async () => {
    await expect(() =>
      sut.execute({
        userID: 'user-02',
        activate: true,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)

    await expect(() =>
      sut.execute({
        userID: 'user-02',
        activate: false,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to activate telegram notification without telegramID when user not has a telegramID', async () => {
    await expect(() =>
      sut.execute({
        userID: 'user-01',
        activate: true,
      }),
    ).rejects.toBeInstanceOf(TelegramIDRequired)
  })
})
