import { Prisma, Users } from '@prisma/client'
import { UsersRepository } from '../users-repository'
import { prisma } from '@/lib/prisma'

export class PrismaUsersRepository implements UsersRepository {
  findByUsername(username: string): Promise<Users | null> {
    const user = prisma.users.findUnique({
      where: {
        username,
      },
    })

    return user
  }

  findByIDAndUpdate(
    userID: string,
    data: Prisma.UsersUpdateInput,
  ): Promise<Users | null> {
    const updatedUser = prisma.users.update({
      where: {
        id: userID,
      },
      data,
    })

    return updatedUser
  }

  findByID(id: string) {
    const user = prisma.users.findUnique({
      where: {
        id,
      },
    })

    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    })

    return user
  }

  async create(data: Prisma.UsersCreateInput) {
    const user = await prisma.users.create({
      data,
    })

    return user
  }
}
