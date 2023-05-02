import { UserManhwa, Prisma } from '@prisma/client'

export interface UserManhwaRepository {
  create(data: Prisma.UserManhwaCreateInput): Promise<UserManhwa>
  addManhwa(
    userID: string,
    data: Prisma.ManhwaUserManhwaCreateInput,
  ): Promise<UserManhwa>
}
