import { UserManhwa, Prisma } from '@prisma/client'
import { DetailedUserManhwa } from './dtos/detailed-user-manhwa'

export interface UserManhwaRepository {
  create(data: Prisma.UserManhwaUncheckedCreateInput): Promise<UserManhwa>
  findByUserIdAndManhwaId(
    userId: bigint,
    manhwaId: bigint,
  ): Promise<UserManhwa | null>
  findByUserId(
    userId: bigint,
    page: number,
    pageSize: number,
    status?: 'ONGOING' | 'COMPLETED' | 'HIATUS',
    userStatus?: 'READING' | 'PAUSED' | 'DROPPED' | 'COMPLETED',
  ): Promise<DetailedUserManhwa[]>
  update(
    id: bigint,
    data: Prisma.UserManhwaUncheckedUpdateInput,
  ): Promise<UserManhwa>
  delete(id: bigint): Promise<void>
  countByUserId(
    userId: bigint,
    status?: 'ONGOING' | 'COMPLETED' | 'HIATUS',
    userStatus?: 'READING' | 'PAUSED' | 'DROPPED' | 'COMPLETED',
  ): Promise<number>
  findManyByUserId(userId: bigint): Promise<UserManhwa[]>
}
