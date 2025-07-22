import { Prisma, Users } from '@prisma/client'

export interface UsersRepository {
  create(data: Prisma.UsersCreateInput): Promise<Users>
  findByEmail(
    email: string | Prisma.StringFieldUpdateOperationsInput,
  ): Promise<Users | null>
  findByID(userID: bigint): Promise<Users | null>
  findByUsername(
    username: string | Prisma.StringFieldUpdateOperationsInput,
  ): Promise<Users | null>
  findByIDAndUpdate(
    userID: bigint,
    data: Prisma.UsersUpdateInput,
  ): Promise<Users | null>
  findByGoogleId(googleId: string): Promise<Users | null>
  findByTelegramLinkingToken(token: string): Promise<Users | null>
  updateTelegram(
    userId: bigint,
    telegramId: string | null,
    telegramActive: boolean,
    telegramLinkingToken?: string | null,
  ): Promise<Users | null>
}
