import { UserManhwa, Prisma, ManhwaUserManhwa } from '@prisma/client'

export interface UserManhwaRepository {
  create(data: Prisma.UserManhwaCreateInput): Promise<UserManhwa>
  addManhwa(
    userID: string,
    data: Prisma.ManhwaUserManhwaCreateInput,
  ): Promise<UserManhwa | null>
  removeManhwa(userID: string, manhwaID: string): Promise<UserManhwa | null>
  getAllManhwas(userID: string): Promise<ManhwaUserManhwa[] | null>
  getManhwasByProfile(userID: string, page: number): Promise<UserManhwa | null>
  updateManhwaOrder(
    userID: string,
    order: Array<{ manhwa_id: string; manhwa_position: number }>,
  ): Promise<string>
  findByManhwaID(
    userID: string,
    manhwaID: string,
  ): Promise<ManhwaUserManhwa | null | undefined>
  getQtyManhwas(userID: string): Promise<number | null>
}
