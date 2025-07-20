import { Users, Prisma } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: Users[] = []

  async findByGoogleId(googleId: string): Promise<Users | null> {
    const user = this.items.find((item) => item.googleId === googleId)

    if (!user) {
      return null
    }

    return user
  }

  async findByIDAndUpdate(
    userID: bigint,
    data: Prisma.UsersUpdateInput,
  ): Promise<Users | null> {
    const indexOfUser = this.items.findIndex((item) => item.id === userID)

    if (indexOfUser === -1) {
      return Promise.resolve(null)
    }

    this.items[indexOfUser] = {
      ...this.items[indexOfUser],
      ...data,
      id: userID,
      updatedAt: new Date(),
    } as Users

    return Promise.resolve(this.items[indexOfUser])
  }

  async findByID(userID: bigint): Promise<Users | null> {
    const user = this.items.find((item) => item.id === userID)

    if (!user) {
      return Promise.resolve(null)
    }

    return Promise.resolve(user)
  }

  async findByEmail(email: string): Promise<Users | null> {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async findByUsername(username: string): Promise<Users | null> {
    const user = this.items.find((item) => item.username === username)

    if (!user) {
      return Promise.resolve(null)
    }

    return Promise.resolve(user)
  }

  async create(data: Prisma.UsersCreateInput): Promise<Users> {
    const user = {
      id: BigInt(this.items.length + 1),
      name: data.name,
      username: data.username,
      email: data.email,
      role: data.role ?? 'USER',
      googleId: data.googleId ?? null,
      password_hash: data.password_hash,
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: data.preferences ?? null,
      lastLogin: data.lastLogin ?? null,
      resetPasswordToken: data.resetPasswordToken ?? null,
      resetPasswordExpires: data.resetPasswordExpires ?? null,
      telegramId: data.telegramId ?? null,
      telegramActive: data.telegramActive ?? false,
    } as Users

    this.items.push(user)

    return Promise.resolve(user)
  }

  async updateTelegram(
    userId: bigint,
    telegramId: string | null,
    telegramActive: boolean,
  ): Promise<Users | null> {
    const indexOfUser = this.items.findIndex((item) => item.id === userId)

    if (indexOfUser === -1) {
      return Promise.resolve(null)
    }

    this.items[indexOfUser] = {
      ...this.items[indexOfUser],
      telegramId,
      telegramActive,
      updatedAt: new Date(),
    } as Users

    return Promise.resolve(this.items[indexOfUser])
  }
}
