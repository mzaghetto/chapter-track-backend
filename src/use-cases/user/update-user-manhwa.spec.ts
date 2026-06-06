import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUserManhwaRepository } from '@/repositories/in-memory/in-memory-user-manhwa-repository'
import { UpdateUserManhwaUseCase } from './update-user-manhwa'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { UserManhwaStatus } from '@prisma/client'

let userManhwaRepository: InMemoryUserManhwaRepository
let sut: UpdateUserManhwaUseCase

const USER_ID = 1n

describe('Update User Manhwa Use Case', () => {
  beforeEach(async () => {
    userManhwaRepository = new InMemoryUserManhwaRepository()
    sut = new UpdateUserManhwaUseCase(userManhwaRepository)

    await userManhwaRepository.create({
      userId: USER_ID,
      manhwaId: 10n,
      status: UserManhwaStatus.READING,
      lastEpisodeRead: 5,
      order: 0,
    })
  })

  it('atualiza o status de leitura (READING -> DROPPED)', async () => {
    const { userManhwa } = await sut.execute({
      userManhwaId: 1n,
      userId: USER_ID,
      data: { status: UserManhwaStatus.DROPPED },
    })

    expect(userManhwa.status).toEqual('DROPPED')
    expect(userManhwaRepository.items[0].status).toEqual('DROPPED')
  })

  it('atualiza o último capítulo lido', async () => {
    const { userManhwa } = await sut.execute({
      userManhwaId: 1n,
      userId: USER_ID,
      data: { lastEpisodeRead: 42 },
    })

    expect(userManhwa.lastEpisodeRead).toEqual(42)
  })

  it('atualiza status e progresso juntos', async () => {
    const { userManhwa } = await sut.execute({
      userManhwaId: 1n,
      userId: USER_ID,
      data: { status: UserManhwaStatus.COMPLETED, lastEpisodeRead: 200 },
    })

    expect(userManhwa.status).toEqual('COMPLETED')
    expect(userManhwa.lastEpisodeRead).toEqual(200)
  })

  it('lança ResourceNotFoundError quando o userManhwa pertence a outro usuário', async () => {
    await expect(() =>
      sut.execute({
        userManhwaId: 1n,
        userId: 999n,
        data: { status: UserManhwaStatus.PAUSED },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
