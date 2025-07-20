import { makeUpdateUserProfileUseCase } from '@/use-cases/factories/make-update-user-profile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function updateProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    name: z.string().optional(),
    username: z.string().optional(),
    email: z.string().email().optional(),
    preferences: z.any().optional(),
  })

  const { name, username, email, preferences } = registerBodySchema.parse(
    request.body,
  )

  const updateUserProfile = makeUpdateUserProfileUseCase()

  const { user } = await updateUserProfile.execute({
    userID: BigInt(request.user.sub),
    data: {
      name,
      username,
      email,
      preferences,
    },
  })

  return reply.status(201).send({
    user: {
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      preferences: user.preferences,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  })
}
