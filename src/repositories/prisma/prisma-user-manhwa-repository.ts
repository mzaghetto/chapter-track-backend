import { UserManhwa, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { UserManhwaRepository } from '../user-manhwa-repository'
import { DetailedUserManhwa } from '../dtos/detailed-user-manhwa'

export class PrismaUserManhwaRepository implements UserManhwaRepository {
  async create(
    data: Prisma.UserManhwaUncheckedCreateInput,
  ): Promise<UserManhwa> {
    return prisma.userManhwa.create({ data })
  }

  async findByUserIdAndManhwaId(
    userId: bigint,
    manhwaId: bigint,
  ): Promise<UserManhwa | null> {
    return prisma.userManhwa.findFirst({
      where: { userId, manhwaId },
    })
  }

  async findByUserId(
    userId: bigint,
    page: number,
    pageSize: number,
    status?: 'ONGOING' | 'COMPLETED' | 'HIATUS',
    userStatus?: 'READING' | 'PAUSED' | 'DROPPED' | 'COMPLETED',
  ): Promise<DetailedUserManhwa[]> {
    const whereClause: Prisma.UserManhwaWhereInput = { userId }

    if (status) {
      whereClause.manhwa = {
        status,
      }
    }

    if (userStatus) {
      whereClause.status = userStatus
    }

    const userManhwas = await prisma.userManhwa.findMany({
      where: whereClause,
      include: {
        manhwa: true,
        provider: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        order: 'asc',
      },
    })

    const manhwaIds = userManhwas.map((um) => um.manhwaId)
    const manhwaProviders = await prisma.manhwaProvider.findMany({
      where: {
        manhwaId: {
          in: manhwaIds,
        },
      },
    })

    const manhwaProvidersGrouped = manhwaProviders.reduce(
      (acc, manhwaProvider) => {
        if (!acc[manhwaProvider.manhwaId.toString()]) {
          acc[manhwaProvider.manhwaId.toString()] = []
        }
        acc[manhwaProvider.manhwaId.toString()].push(manhwaProvider)
        return acc
      },
      {} as Record<string, any[]>,
    )

    const userNotifications = await prisma.userNotifications.findMany({
      where: {
        userId,
        manhwaId: {
          in: manhwaIds,
        },
      },
    })

    return userManhwas.map((userManhwa) => {
      const manhwaProvider = manhwaProviders.find(
        (mp) =>
          mp.manhwaId === userManhwa.manhwaId &&
          mp.providerId === userManhwa.providerId,
      )
      const userNotification = userNotifications.find(
        (un) => un.manhwaId === userManhwa.manhwaId,
      )

      const lastEpisodeReleasedAllProviders = Math.max(
        ...manhwaProvidersGrouped[userManhwa.manhwaId.toString()].map(
          (mp) => mp.lastEpisodeReleased,
        ),
      )

      return {
        id: userManhwa.id,
        manhwaId: userManhwa.manhwaId,
        manhwaName: userManhwa.manhwa.name,
        coverImage: userManhwa.manhwa.coverImage,
        providerId: userManhwa.providerId,
        providerName: userManhwa.provider?.name ?? null,
        lastEpisodeReleased: manhwaProvider?.lastEpisodeReleased ?? null,
        lastEpisodeReleasedAllProviders,
        manhwaUrlProvider: manhwaProvider?.url ?? null,
        statusReading: userManhwa.status,
        statusManhwa: userManhwa.manhwa.status,
        lastEpisodeRead: userManhwa.lastEpisodeRead,
        lastNotifiedEpisode: userManhwa.lastNotifiedEpisode,
        isTelegramNotificationEnabled: userNotification?.isEnabled ?? false,
        order: userManhwa.order,
        lastUpdated: userManhwa.lastUpdated,
        createdAt: userManhwa.createdAt,
        updatedAt: userManhwa.updatedAt,
      }
    })
  }

  async update(
    id: bigint,
    data: Prisma.UserManhwaUncheckedUpdateInput,
  ): Promise<UserManhwa> {
    return prisma.userManhwa.update({
      where: { id },
      data,
    })
  }

  async delete(id: bigint): Promise<void> {
    await prisma.userManhwa.delete({ where: { id } })
  }

  async countByUserId(
    userId: bigint,
    status?: 'ONGOING' | 'COMPLETED' | 'HIATUS',
    userStatus?: 'READING' | 'PAUSED' | 'DROPPED' | 'COMPLETED',
  ): Promise<number> {
    const whereClause: Prisma.UserManhwaWhereInput = { userId }

    if (status) {
      whereClause.manhwa = {
        status,
      }
    }

    if (userStatus) {
      whereClause.status = userStatus
    }

    return prisma.userManhwa.count({ where: whereClause })
  }

  async findManyByUserId(userId: bigint): Promise<UserManhwa[]> {
    return prisma.userManhwa.findMany({
      where: { userId },
      orderBy: {
        order: 'asc',
      },
    })
  }
}
