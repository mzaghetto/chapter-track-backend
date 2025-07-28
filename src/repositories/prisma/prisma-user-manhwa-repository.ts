import { UserManhwa, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { UserManhwaRepository } from '../user-manhwa-repository'
import { DetailedUserManhwa } from '../dtos/detailed-user-manhwa'

interface RawUserManhwaQueryResult extends UserManhwa {
  manhwaname: string | null
  coverimage: string | null
  statusmanhwa: 'ONGOING' | 'COMPLETED' | 'HIATUS' | null
  providername: string | null
  alternativenames: string | null
}

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
    manhwaName?: string,
  ): Promise<DetailedUserManhwa[]> {
    const whereConditions: string[] = [`"userId" = ${userId}`]

    if (status) {
      whereConditions.push(`"Manhwas"."status" = '${status}'`)
    }

    if (userStatus) {
      whereConditions.push(`"UserManhwa"."status" = '${userStatus}'`)
    }

    if (manhwaName) {
      whereConditions.push(
        `("Manhwas"."name" ILIKE '%${manhwaName}%' OR EXISTS(SELECT 1 FROM jsonb_array_elements_text("Manhwas"."alternativeNames") AS elem WHERE elem ILIKE '%${manhwaName}%'))`,
      )
    }

    const whereClause =
      whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    const userManhwas = await prisma.$queryRaw<
      RawUserManhwaQueryResult[]
    >(Prisma.sql`
      SELECT
        "UserManhwa".id,
        "UserManhwa"."userId",
        "UserManhwa"."manhwaId",
        "UserManhwa"."providerId",
        "UserManhwa".status,
        "UserManhwa"."lastEpisodeRead",
        "UserManhwa"."lastNotifiedEpisode",
        "UserManhwa".order,
        "UserManhwa"."lastUpdated",
        "UserManhwa"."createdAt",
        "UserManhwa"."updatedAt",
        "Manhwas".name AS manhwaName,
        "Manhwas"."coverImage" AS coverImage,
        "Manhwas".status AS statusManhwa,
        "Manhwas"."alternativeNames" AS alternativeNames,
        "Providers".name AS providerName
      FROM "UserManhwa"
      JOIN "Manhwas" ON "UserManhwa"."manhwaId" = "Manhwas".id
      LEFT JOIN "Providers" ON "UserManhwa"."providerId" = "Providers".id
      ${Prisma.raw(whereClause)}
      ORDER BY "UserManhwa".order ASC
      OFFSET ${(page - 1) * pageSize} LIMIT ${pageSize}
    `)

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

      const releasedEpisodes =
        manhwaProvidersGrouped[userManhwa.manhwaId.toString()]
          ?.map((mp) => mp.lastEpisodeReleased)
          .filter((ep) => ep !== null && ep !== undefined) || []

      const lastEpisodeReleasedAllProviders =
        releasedEpisodes.length > 0
          ? Math.max(...(releasedEpisodes as number[]))
          : null

      return {
        id: userManhwa.id,
        manhwaId: userManhwa.manhwaId,
        manhwaName: userManhwa.manhwaname,
        coverImage: userManhwa.coverimage,
        providerId: userManhwa.providerId,
        providerName: userManhwa.providername ?? null,
        lastEpisodeReleased: lastEpisodeReleasedAllProviders,
        lastEpisodeReleasedAllProviders,
        manhwaUrlProvider: manhwaProvider?.url ?? null,
        statusReading: userManhwa.status,
        statusManhwa: userManhwa.statusmanhwa,
        alternativeNames: userManhwa.alternativenames,
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
    manhwaName?: string,
  ): Promise<number> {
    const whereConditions: string[] = [`"userId" = ${userId}`]

    if (status) {
      whereConditions.push(`"Manhwas"."status" = '${status}'`)
    }

    if (userStatus) {
      whereConditions.push(`"UserManhwa"."status" = '${userStatus}'`)
    }

    if (manhwaName) {
      whereConditions.push(
        `("Manhwas"."name" ILIKE '%${manhwaName}%' OR EXISTS(SELECT 1 FROM jsonb_array_elements_text("Manhwas"."alternativeNames") AS elem WHERE elem ILIKE '%${manhwaName}%'))`,
      )
    }

    const whereClause =
      whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    const totalItems = await prisma.$queryRaw<[{ count: bigint }]>(Prisma.sql`
      SELECT COUNT(*)
      FROM "UserManhwa"
      JOIN "Manhwas" ON "UserManhwa"."manhwaId" = "Manhwas".id
      ${Prisma.raw(whereClause)}
    `)

    return Number(totalItems[0].count)
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
