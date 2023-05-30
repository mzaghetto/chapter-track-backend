import { ManhwaUserManhwa, Prisma, UserManhwa } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { UserManhwaRepository } from '../user-manhwa-repository'

export class PrismaUserManhwaRepository implements UserManhwaRepository {
  async create(data: Prisma.UserManhwaCreateInput): Promise<UserManhwa> {
    const userManhwa = await prisma.userManhwa.create({
      data,
    })

    return userManhwa
  }

  async addManhwa(
    userID: string,
    data: Prisma.ManhwaUserManhwaCreateInput,
  ): Promise<UserManhwa | null> {
    const manhwa = await prisma.userManhwa.findFirst({
      where: {
        user_id: userID,
      },
    })

    const updatedUser = await prisma.userManhwa.update({
      where: { id: manhwa?.id },
      data: {
        manhwas: { push: data },
      },
      include: { manhwas: true },
    })

    if (!updatedUser) {
      return null
    }

    return updatedUser
  }

  removeManhwa(userID: string, manhwaID: string): Promise<UserManhwa | null> {
    throw new Error('Method not implemented.')
  }

  getAllManhwas(userID: string): Promise<ManhwaUserManhwa[] | null> {
    throw new Error('Method not implemented.')
  }

  getManhwasByProfile(
    userID: string,
    page: number,
  ): Promise<UserManhwa | null> {
    throw new Error('Method not implemented.')
  }

  updateManhwaOrder(
    userID: string,
    order: { manhwa_id: string; manhwa_position: number }[],
  ): Promise<string> {
    throw new Error('Method not implemented.')
  }

  async findByManhwaID(
    userID: string,
    manhwaID: string,
  ): Promise<UserManhwa | null> {
    const manhwa = await prisma.userManhwa.findFirst({
      where: {
        user_id: userID,
        manhwas: {
          some: {
            manhwa_id: manhwaID,
          },
        },
      },
    })

    return manhwa
  }

  async getQtyManhwas(userID: string): Promise<number | null> {
    const userManhwa = await prisma.userManhwa.findFirst({
      where: {
        user_id: userID,
      },
    })

    const user = await prisma.userManhwa.findUnique({
      where: {
        id: userManhwa?.id,
      },
      select: {
        manhwas: true,
      },
    })

    if (!user) {
      return null
    }

    return user.manhwas.length
  }
}
