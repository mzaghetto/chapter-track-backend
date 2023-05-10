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
    const userIDManhwa = await prisma.userManhwa.update({
      where: {
        id: userID,
      },
      data: {
        manhwas: data,
      },
    })

    return userIDManhwa
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

  findByManhwaID(
    userID: string,
    manhwaID: string,
  ): Promise<ManhwaUserManhwa | null | undefined> {
    throw new Error('Method not implemented.')
  }

  getQtyManhwas(userID: string): Promise<number | null> {
    throw new Error('Method not implemented.')
  }
}
