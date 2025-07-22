import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeGetUserProfileUseCase()

  const { user } = await getUserProfile.execute({
    userID: BigInt(request.user.sub),
  })

  return reply.status(201).send({
    user: {
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      preferences: user.preferences,
      lastLogin: user.lastLogin,
      telegramId: user.telegramId,
      telegramActive: user.telegramActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  })
}
