import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUserManhwaRepository } from '@/repositories/in-memory/in-memory-user-manhwa-repository'
import { InMemoryManhwasRepository } from '@/repositories/in-memory/in-memory-manhwas-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { OrganizeManhwasUseCase } from './organize-manhwas'
import { ManhwaPositionNegativeError } from './errors/manhwa-position-negative-error'
import { ManhwaPositionBreakOrderError } from './errors/manhwa-position-break-order-error'
import { ManhwaPositionAlreadyTakenError } from './errors/manhwa-position-already-taken-error'
import { InvalidManhwaIdError } from './errors/invalid-manhwa-id-error'

let usersRepository: InMemoryUsersRepository
let userManhwaRepository: InMemoryUserManhwaRepository
let manhwasRepository: InMemoryManhwasRepository
let sut: OrganizeManhwasUseCase

describe('Organize Manhwa Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    userManhwaRepository = new InMemoryUserManhwaRepository()
    manhwasRepository = new InMemoryManhwasRepository()
    sut = new OrganizeManhwasUseCase(userManhwaRepository)

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
    for (let i = 0; i <= 22; i++) {
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
    for (let i = 0; i <= 22; i++) {
      await userManhwaRepository.addManhwa('user-01', {
        manhwa_id: `manhwa-${i}`,
        manhwa_position: i,
        last_episode_read: 0,
        read_url: ['https://www.mangageko.com/manga/manga-1773/'],
        notify_telegram: false,
        notification_website: true,
      })
    }
  })

  it('should be able to organize the list os manhwas', async () => {
    const order = [
      { manhwa_id: 'manhwa-2', manhwa_position: 0 },
      { manhwa_id: 'manhwa-1', manhwa_position: 1 },
      { manhwa_id: 'manhwa-0', manhwa_position: 2 },
      { manhwa_id: 'manhwa-12', manhwa_position: 13 },
      { manhwa_id: 'manhwa-13', manhwa_position: 12 },
    ]

    const { userManhwa } = await sut.execute({
      userID: 'user-01',
      order,
    })

    expect(userManhwa).toEqual('Atualizado com sucesso!')
  })

  it('should not be able to send the manhwa id invalid', async () => {
    const order = [
      { manhwa_id: 'manhwa-1', manhwa_position: 1 },
      { manhwa_id: 'manhwa-2', manhwa_position: 2 },
      { manhwa_id: 'manhwa-03', manhwa_position: 3 },
    ]

    await expect(
      sut.execute({
        userID: 'user-01',
        order,
      }),
    ).rejects.toBeInstanceOf(InvalidManhwaIdError)
  })

  it('should not be able to send the manhwa position negative', async () => {
    const order = [
      { manhwa_id: 'manhwa-3', manhwa_position: -2 },
      { manhwa_id: 'manhwa-2', manhwa_position: 25 },
      { manhwa_id: 'manhwa-1', manhwa_position: 1 },
    ]

    await expect(
      sut.execute({
        userID: 'user-01',
        order,
      }),
    ).rejects.toBeInstanceOf(ManhwaPositionNegativeError)
  })

  it('should not be able to send the manhwa position that breaks the order', async () => {
    const order = [
      { manhwa_id: 'manhwa-3', manhwa_position: 1 },
      { manhwa_id: 'manhwa-2', manhwa_position: 2 },
      { manhwa_id: 'manhwa-1', manhwa_position: 4 },
    ]

    await expect(
      sut.execute({
        userID: 'user-01',
        order,
      }),
    ).rejects.toBeInstanceOf(ManhwaPositionBreakOrderError)
  })

  it('should not be able to send the manhwa position twice', async () => {
    const order = [
      { manhwa_id: 'manhwa-1', manhwa_position: 1 },
      { manhwa_id: 'manhwa-2', manhwa_position: 2 },
      { manhwa_id: 'manhwa-22', manhwa_position: 2 },
    ]

    await expect(
      sut.execute({
        userID: 'user-01',
        order,
      }),
    ).rejects.toBeInstanceOf(ManhwaPositionAlreadyTakenError)
  })
})
