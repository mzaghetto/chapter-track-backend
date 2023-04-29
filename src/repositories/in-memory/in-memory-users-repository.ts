import { Users } from '@prisma/client'
import { UsersRepository } from '../users-repository'
import { randomUUID } from 'crypto'

export class InMemoryUsersRepository implements UsersRepository {
  public items: Users[] = []

  async findByIDAndUpdate(userID: string, data: Users): Promise<Users | null> {
    const indexOfUser = this.items.findIndex((item) => item.id === userID)

    if (indexOfUser === -1) {
      return Promise.resolve(null)
    }

    this.items[indexOfUser] = {
      ...this.items[indexOfUser],
      ...data,
      updated_at: new Date(),
    }

    return Promise.resolve(this.items[indexOfUser])
  }

  async findByID(userID: string): Promise<Users | null> {
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

  async create(data: Users): Promise<Users> {
    const user = {
      id: randomUUID(),
      name: data.name,
      username: data.username,
      email: data.email,
      role: data.role,
      password_hash: data.password_hash,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.items.push(user)

    return Promise.resolve(user)
  }
}
