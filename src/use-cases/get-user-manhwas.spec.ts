import { expect, describe, it, beforeEach } from 'vitest'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { InMemoryUserManhwaRepository } from '@/repositories/in-memory/in-memory-user-manhwa-repository'
import { InMemoryManhwasRepository } from '@/repositories/in-memory/in-memory-manhwas-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { GetUserManhwasUseCase } from './get-user-manhwas'

let usersRepository: InMemoryUsersRepository
let userManhwaRepository: InMemoryUserManhwaRepository
let manhwasRepository: InMemoryManhwasRepository
let sut: GetUserManhwasUseCase

describe('Get User Manhwas Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    userManhwaRepository = new InMemoryUserManhwaRepository()
    manhwasRepository = new InMemoryManhwasRepository()
    sut = new GetUserManhwasUseCase(userManhwaRepository)

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
        last_episode_released: 429,
        last_episode_notified: 428,
        available_read_url: ['Mangatop', 'MCReader', 'Neox'],
        manhwa_thumb: 'http://www.thum-qualquer.com',
        url_crawler: 'https://www.mangageko.com/manga/manga-1773/',
        users_to_notify: [],
      })
    }

    // add several manhwas to pagination
    for (let i = 1; i <= 22; i++) {
      await userManhwaRepository.addManhwa('user-01', {
        manhwa_id: `manhwa-${i}`,
        manhwa_position: 0,
        last_episode_read: 0,
        read_url: ['https://www.mangageko.com/manga/manga-1773/'],
        notify_telegram: false,
        notification_website: true,
      })
    }
  })

  it('should be able to get all manhwas of user profile', async () => {
    const { userManhwa } = await sut.execute({
      userID: 'user-01',
      page: 1,
    })

    expect(userManhwa.manhwas.length).toEqual(20)
  })

  it('should be able to get page 2 manhwas of user profile', async () => {
    await sut.execute({
      userID: 'user-01',
      page: 2,
    })

    expect.objectContaining({ name: 'The Gamer 21' })
  })

  it('should not be able to get manhwas of user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userID: 'non-existing-id',
        page: 1,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
