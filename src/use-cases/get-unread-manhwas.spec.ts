import { expect, describe, it, beforeEach } from 'vitest'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { InMemoryUserManhwaRepository } from '@/repositories/in-memory/in-memory-user-manhwa-repository'
import { InMemoryManhwasRepository } from '@/repositories/in-memory/in-memory-manhwas-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { GetUnreadManhwasUseCase } from './get-unread-manhwas'

let usersRepository: InMemoryUsersRepository
let userManhwaRepository: InMemoryUserManhwaRepository
let manhwasRepository: InMemoryManhwasRepository
let sut: GetUnreadManhwasUseCase

describe('Get Unread Manhwas Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    userManhwaRepository = new InMemoryUserManhwaRepository()
    manhwasRepository = new InMemoryManhwasRepository()
    sut = new GetUnreadManhwasUseCase(userManhwaRepository, manhwasRepository)

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

    // create several manhwas to pagination
    for (let i = 1; i <= 22; i++) {
      await manhwasRepository.create({
        id: `manhwa-${i}`,
        name: `The Gamer ${i}`,
        last_episode_released: 2,
        last_episode_notified: 1,
        available_read_url: ['Mangatop', 'MCReader', 'Neox'],
        manhwa_thumb: 'http://www.thum-qualquer.com',
        url_crawler: 'https://www.mangageko.com/manga/manga-1773/',
        users_to_notify: [],
      })
    }
  })

  it('should be able to get all unread manhwas of user', async () => {
    await userManhwaRepository.addManhwa('user-01', {
      manhwa_id: `manhwa-3`,
      manhwa_position: 0,
      last_episode_read: 1,
      read_url: ['https://www.mangageko.com/manga/manga-1773/'],
      notify_telegram: false,
      notification_website: true,
    })

    await userManhwaRepository.addManhwa('user-01', {
      manhwa_id: `manhwa-12`,
      manhwa_position: 1,
      last_episode_read: 1,
      read_url: ['https://www.mangageko.com/manga/manga-1773/'],
      notify_telegram: false,
      notification_website: true,
    })

    await userManhwaRepository.addManhwa('user-01', {
      manhwa_id: `manhwa-20`,
      manhwa_position: 2,
      last_episode_read: 2,
      read_url: ['https://www.mangageko.com/manga/manga-1773/'],
      notify_telegram: false,
      notification_website: true,
    })

    const { unreadManhwas } = await sut.execute({
      user_id: 'user-01',
    })

    expect(unreadManhwas.length).toEqual(2)
  })

  it('should not be able to get unread manhwas if user do not exists', async () => {
    await expect(() =>
      sut.execute({
        user_id: 'user-not-exists',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
