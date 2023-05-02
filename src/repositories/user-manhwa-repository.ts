import { UserManhwa, Prisma } from '@prisma/client'

export interface UserManhwaRepository {
  create(data: Prisma.UserManhwaCreateInput): Promise<UserManhwa>
  addManhwa(
    userID: string,
    data: Prisma.ManhwaUserManhwaCreateInput,
  ): Promise<UserManhwa>
  findByManhwaID(
    userID: string,
    manhwaID: string,
  ): Promise<UserManhwa | null | undefined>
  getQtyManhwas(userID: string): Promise<number>
}
