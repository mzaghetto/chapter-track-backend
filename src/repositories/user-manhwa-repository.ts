import { UserManhwa, Prisma, ManhwaUserManhwa } from '@prisma/client'

export interface UserManhwaRepository {
  create(data: Prisma.UserManhwaCreateInput): Promise<UserManhwa>
  addManhwa(
    userID: string,
    data: Prisma.ManhwaUserManhwaCreateInput,
  ): Promise<UserManhwa>
  removeManhwa(userID: string, manhwaID: string): Promise<UserManhwa>
  getAllManhwas(userID: string): Promise<ManhwaUserManhwa[]>
  getManhwasByProfile(userID: string, page: number): Promise<UserManhwa>
  updateManhwaOrder(
    userID: string,
    order: Array<{ manhwa_id: string; manhwa_position: number }>,
  ): Promise<string>
  findByManhwaID(
    userID: string,
    manhwaID: string,
  ): Promise<UserManhwa | null | undefined>
  getQtyManhwas(userID: string): Promise<number>
}
