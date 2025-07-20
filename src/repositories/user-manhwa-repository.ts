import { UserManhwa, Prisma } from '@prisma/client'

export interface UserManhwaRepository {
  create(data: Prisma.UserManhwaUncheckedCreateInput): Promise<UserManhwa>
  findByUserIdAndManhwaId(
    userId: bigint,
    manhwaId: bigint,
  ): Promise<UserManhwa | null>
  findByUserId(userId: bigint, page: number, pageSize: number): Promise<UserManhwa[]>
  update(id: bigint, data: Prisma.UserManhwaUncheckedUpdateInput): Promise<UserManhwa>
  delete(id: bigint): Promise<void>
  countByUserId(userId: bigint): Promise<number>
  findManyByUserId(userId: bigint): Promise<UserManhwa[]>
}