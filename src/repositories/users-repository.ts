import { Prisma, Users } from '@prisma/client'

export interface UsersRepository {
  create(data: Prisma.UsersCreateInput): Promise<Users>
  findByEmail(
    email: string | Prisma.StringFieldUpdateOperationsInput,
  ): Promise<Users | null>
  findByID(userID: string): Promise<Users | null>
  findByUsername(
    username: string | Prisma.StringFieldUpdateOperationsInput,
  ): Promise<Users | null>
  findByIDAndUpdate(
    userID: string,
    data: Prisma.UsersUpdateInput,
  ): Promise<Users | null>
  findByGoogleId(googleId: string): Promise<Users | null>
}
