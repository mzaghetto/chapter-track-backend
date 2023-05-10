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
  })

  const { name, username, email } = registerBodySchema.parse(request.body)

  const updateUserProfile = makeUpdateUserProfileUseCase()

  const { user } = await updateUserProfile.execute({
    userID: request.user.sub,
    data: {
      name,
      username,
      email,
    },
  })

  return reply.status(201).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  })
}
