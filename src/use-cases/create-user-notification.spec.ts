import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUserNotificationsRepository } from '@/repositories/in-memory/in-memory-user-notifications-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryManhwasRepository } from '@/repositories/in-memory/in-memory-manhwas-repository'
import { CreateUserNotificationUseCase } from './create-user-notification'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { NotificationChannel } from '@prisma/client'
import { hash } from 'bcryptjs'

let userNotificationsRepository: InMemoryUserNotificationsRepository
let usersRepository: InMemoryUsersRepository
let manhwasRepository: InMemoryManhwasRepository
let sut: CreateUserNotificationUseCase

describe('Create User Notification Use Case', () => {
  beforeEach(async () => {
    userNotificationsRepository = new InMemoryUserNotificationsRepository()
    usersRepository = new InMemoryUsersRepository()
    manhwasRepository = new InMemoryManhwasRepository()
    sut = new CreateUserNotificationUseCase(
      userNotificationsRepository,
      usersRepository,
      manhwasRepository,
    )

    await usersRepository.create({
      id: BigInt(1),
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await manhwasRepository.create({
      id: BigInt(1),
      name: 'The Gamer',
      author: 'Someone',
      genre: 'Fantasy',
      coverImage: 'http://example.com/cover.jpg',
      description: 'A cool story',
      status: 'ONGOING',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  })

  it('should be able to create a user notification', async () => {
    const { userNotification } = await sut.execute({
      userId: BigInt(1),
      manhwaId: BigInt(1),
      channel: NotificationChannel.TELEGRAM,
    })

    expect(userNotification.id).toEqual(expect.any(BigInt))
    expect(userNotification.userId).toEqual(BigInt(1))
    expect(userNotification.manhwaId).toEqual(BigInt(1))
    expect(userNotification.channel).toEqual(NotificationChannel.TELEGRAM)
  })

  it('should not be able to create a user notification for a non-existent user', async () => {
    await expect(() =>
      sut.execute({
        userId: BigInt(99),
        manhwaId: BigInt(1),
        channel: NotificationChannel.TELEGRAM,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to create a user notification for a non-existent manhwa', async () => {
    await expect(() =>
      sut.execute({
        userId: BigInt(1),
        manhwaId: BigInt(99),
        channel: NotificationChannel.TELEGRAM,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})