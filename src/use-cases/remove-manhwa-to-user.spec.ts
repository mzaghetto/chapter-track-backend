import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUserManhwaRepository } from '@/repositories/in-memory/in-memory-user-manhwa-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { InMemoryManhwasRepository } from '@/repositories/in-memory/in-memory-manhwas-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { RemoveManhwaToUserManhwaUseCase } from './remove-manhwa-to-user'

let usersRepository: InMemoryUsersRepository
let userManhwaRepository: InMemoryUserManhwaRepository
let manhwasRepository: InMemoryManhwasRepository
let sut: RemoveManhwaToUserManhwaUseCase

describe('Remove Manhwa from User Manhwa Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    userManhwaRepository = new InMemoryUserManhwaRepository()
    manhwasRepository = new InMemoryManhwasRepository()
    sut = new RemoveManhwaToUserManhwaUseCase(
      userManhwaRepository,
      manhwasRepository,
    )

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

    await manhwasRepository.create({
      id: 'manhwa-01',
      name: 'The Gamer',
      last_episode_released: 429,
      last_episode_notified: 428,
      available_read_url: ['Mangatop', 'MCReader', 'Neox'],
      manhwa_thumb: 'http://www.thum-qualquer.com',
      url_crawler: 'https://www.mangageko.com/manga/manga-1773/',
      users_to_notify: [],
    })

    await manhwasRepository.create({
      id: 'manhwa-02',
      name: 'The Hero',
      last_episode_released: 123,
      last_episode_notified: 124,
      available_read_url: ['Mangatop', 'MCReader', 'Neox'],
      manhwa_thumb: 'http://www.thum-qualquer.com',
      url_crawler: 'https://www.mangageko.com/manga/manga-1773/',
      users_to_notify: [],
    })

    await manhwasRepository.create({
      id: 'manhwa-03',
      name: 'The Baka',
      last_episode_released: 123,
      last_episode_notified: 124,
      available_read_url: ['Mangatop', 'MCReader', 'Neox'],
      manhwa_thumb: 'http://www.thum-qualquer.com',
      url_crawler: 'https://www.mangageko.com/manga/manga-1773/',
      users_to_notify: [],
    })

    await userManhwaRepository.create({
      id: 'user-manhwa-01',
      user_id: 'user-01',
      manhwas: [],
      telegram_id: null,
      telegram_active: false,
    })

    await userManhwaRepository.addManhwa('user-01', {
      manhwa_id: 'manhwa-01',
      manhwa_position: 0,
      last_episode_read: 0,
      read_url: ['https://www.mangageko.com/manga/manga-1773/'],
      notify_telegram: false,
      notification_website: true,
    })

    await userManhwaRepository.addManhwa('user-01', {
      manhwa_id: 'manhwa-02',
      manhwa_position: 0,
      last_episode_read: 0,
      read_url: ['https://www.mangageko.com/manga/manga-1773/'],
      notify_telegram: false,
      notification_website: true,
    })

    await userManhwaRepository.addManhwa('user-01', {
      manhwa_id: 'manhwa-03',
      manhwa_position: 0,
      last_episode_read: 0,
      read_url: ['https://www.mangageko.com/manga/manga-1773/'],
      notify_telegram: false,
      notification_website: true,
    })
  })

  it('should be able to remove a manhwa from a user in user manhwa', async () => {
    const { userManhwa } = await sut.execute({
      user_id: 'user-01',
      manhwaID: 'manhwa-01',
    })

    expect(userManhwa.manhwas.length).toEqual(2)
    expect(userManhwa.manhwas[0].manhwa_id).toEqual('manhwa-02')
  })

  it('should not be able to remove a manhwa from a user in user manhwa with a invalid userID', async () => {
    await expect(() =>
      sut.execute({
        user_id: 'user-not-exists',
        manhwaID: 'manhwa-01',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to remove a manhwa not registered in user manhwa', async () => {
    await sut.execute({
      user_id: 'user-01',
      manhwaID: 'manhwa-03',
    })

    await expect(() =>
      sut.execute({
        user_id: 'user-01',
        manhwaID: 'manhwa-03',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to remove a manhwa from a user in user manhwa with a invalid manhwaID', async () => {
    await expect(() =>
      sut.execute({
        user_id: 'user-01',
        manhwaID: 'manhwa-not-exists',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
