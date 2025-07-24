import { FastifyInstance } from 'fastify'
import { prisma } from '../../lib/prisma'
import { hash } from 'bcryptjs'

export async function createAndAuthenticateUser(app: FastifyInstance, isAdmin = false) {
  const user = await prisma.users.create({
    data: {
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      role: isAdmin ? 'ADMIN' : 'USER',
    },
  })

  const response = await app.inject({
    method: 'POST',
    url: '/sessions',
    payload: {
      email: 'johndoe@example.com',
      password: '123456',
    },
  })

  const { token } = response.json().data

  return { user, token }
}
