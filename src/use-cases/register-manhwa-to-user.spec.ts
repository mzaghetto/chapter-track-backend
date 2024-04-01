import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUserManhwaRepository } from '@/repositories/in-memory/in-memory-user-manhwa-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { AddManhwaToUserManhwaUseCase } from './register-manhwa-to-user'
import { InMemoryManhwasRepository } from '@/repositories/in-memory/in-memory-manhwas-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { ManhwaAlreadyExistsError } from './errors/manhwa-already-exists-error'

let usersRepository: InMemoryUsersRepository
let userManhwaRepository: InMemoryUserManhwaRepository
let manhwasRepository: InMemoryManhwasRepository
let sut: AddManhwaToUserManhwaUseCase

describe('Register Manhwa to User Manhwa Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    userManhwaRepository = new InMemoryUserManhwaRepository()
    manhwasRepository = new InMemoryManhwasRepository()
    sut = new AddManhwaToUserManhwaUseCase(
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
      name: 'The Hero 03',
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
      manhwa: [],
      telegram_id: null,
      telegram_active: false,
    })
  })

  it('should be able to add a manhwa in user manhwa', async () => {
    const { userManhwa } = await sut.execute({
      user_id: 'user-01',
      manhwa: {
        manhwa_id: 'manhwa-01',
        manhwa_position: 0,
        last_episode_read: 0,
        read_url: ['https://www.mangageko.com/manga/manga-1773/'],
        notify_telegram: false,
        notification_website: true,
      },
    })

    expect(userManhwa.manhwas.length).toEqual(1)
    expect(userManhwa.manhwas[0].manhwa_id).toEqual('manhwa-01')
  })

  it('should not be able to add a manhwa in a non-existent user to user manhwa', async () => {
    await expect(() =>
      sut.execute({
        user_id: 'user-02',
        manhwa: {
          manhwa_id: 'manhwa-01',
          manhwa_position: 0,
          last_episode_read: 0,
          read_url: ['https://www.mangageko.com/manga/manga-1773/'],
          notify_telegram: false,
          notification_website: true,
        },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to add a manhwa with a non-existent manhwa to user manhwa', async () => {
    await expect(() =>
      sut.execute({
        user_id: 'user-01',
        manhwa: {
          manhwa_id: 'manhwa-non-existent',
          manhwa_position: 0,
          last_episode_read: 0,
          read_url: ['https://www.mangageko.com/manga/manga-1773/'],
          notify_telegram: false,
          notification_website: true,
        },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to add a manhwa that has already been registered in manhwa to user manhwa', async () => {
    await sut.execute({
      user_id: 'user-01',
      manhwa: {
        manhwa_id: 'manhwa-01',
        manhwa_position: 0,
        last_episode_read: 0,
        read_url: ['https://www.mangageko.com/manga/manga-1773/'],
        notify_telegram: false,
        notification_website: true,
      },
    })

    await expect(() =>
      sut.execute({
        user_id: 'user-01',
        manhwa: {
          manhwa_id: 'manhwa-01',
          manhwa_position: 0,
          last_episode_read: 0,
          read_url: ['https://www.mangageko.com/manga/manga-1773/'],
          notify_telegram: false,
          notification_website: true,
        },
      }),
    ).rejects.toBeInstanceOf(ManhwaAlreadyExistsError)
  })

  it('should be auto increment the position of the manhwa in user manhwa', async () => {
    await sut.execute({
      user_id: 'user-01',
      manhwa: {
        manhwa_id: 'manhwa-01',
        manhwa_position: 0,
        last_episode_read: 0,
        read_url: ['https://www.mangageko.com/manga/manga-1773/'],
        notify_telegram: false,
        notification_website: true,
      },
    })

    await sut.execute({
      user_id: 'user-01',
      manhwa: {
        manhwa_id: 'manhwa-02',
        manhwa_position: 0,
        last_episode_read: 0,
        read_url: ['https://www.mangageko.com/manga/manga-1773/'],
        notify_telegram: false,
        notification_website: true,
      },
    })

    const { userManhwa } = await sut.execute({
      user_id: 'user-01',
      manhwa: {
        manhwa_id: 'manhwa-03',
        manhwa_position: 0,
        last_episode_read: 0,
        read_url: ['https://www.mangageko.com/manga/manga-1773/'],
        notify_telegram: false,
        notification_website: true,
      },
    })

    expect(userManhwa.manhwas[0].manhwa_position).toEqual(0)
    expect(userManhwa.manhwas[2].manhwa_position).toEqual(2)
  })
})
