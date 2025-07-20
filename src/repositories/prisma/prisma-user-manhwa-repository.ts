import { UserManhwa, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { UserManhwaRepository } from '../user-manhwa-repository'

export class PrismaUserManhwaRepository implements UserManhwaRepository {
  async create(data: Prisma.UserManhwaUncheckedCreateInput): Promise<UserManhwa> {
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

  async findByUserId(userId: bigint, page: number, pageSize: number): Promise<UserManhwa[]> {
    return prisma.userManhwa.findMany({
      where: { userId },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        order: 'asc',
      },
    })
  }

  async update(id: bigint, data: Prisma.UserManhwaUncheckedUpdateInput): Promise<UserManhwa> {
    return prisma.userManhwa.update({
      where: { id },
      data,
    })
  }

  async delete(id: bigint): Promise<void> {
    await prisma.userManhwa.delete({ where: { id } })
  }

  async countByUserId(userId: bigint): Promise<number> {
    return prisma.userManhwa.count({ where: { userId } })
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