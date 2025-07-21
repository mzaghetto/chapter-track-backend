import { Prisma, Users } from '@prisma/client'
import { UsersRepository } from '../users-repository'
import { prisma } from '@/lib/prisma'

export class PrismaUsersRepository implements UsersRepository {
  async findByGoogleId(googleId: string): Promise<Users | null> {
    const user = await prisma.users.findFirst({
      where: {
        googleId,
      },
    })

    return user
  }

  findByUsername(
    username: string | Prisma.StringFieldUpdateOperationsInput,
  ): Promise<Users | null> {
    const user = prisma.users.findUnique({
      where: {
        username: username.toString(),
      },
    })

    return user
  }

  findByIDAndUpdate(
    userID: bigint,
    data: Prisma.UsersUpdateInput,
  ): Promise<Users | null> {
    const updatedUser = prisma.users.update({
      where: {
        id: userID,
      },
      data: {
        ...data,
      },
    })

    return updatedUser
  }

  findByID(id: bigint) {
    const user = prisma.users.findUnique({
      where: {
        id,
      },
    })

    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    })

    return user
  }

  async create(data: Prisma.UsersCreateInput) {
    const user = await prisma.users.create({
      data,
    })

    return user
  }

  async updateTelegram(
    userId: bigint,
    telegramId: string | null,
    telegramActive: boolean,
  ): Promise<Users | null> {
    const updatedUser = await prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        telegramId,
        telegramActive,
      },
    })
    return updatedUser
  }

  async findByTelegramLinkingToken(token: string): Promise<Users | null> {
    const user = await prisma.users.findUnique({
      where: {
        telegramLinkingToken: token,
      },
    })
    return user
  }
}
