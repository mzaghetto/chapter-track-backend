import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { makeRemoveManhwaToUserUseCase } from '@/use-cases/factories/make-remove-manhwa-to-user-use-case'

export async function removeManhwaToUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const removeManhwaToUserBodySchema = z.object({
    manhwa_id: z.string(),
  })

  const { manhwa_id } = removeManhwaToUserBodySchema.parse(request.body)

  try {
    const removeManhwaToUserUseCase = makeRemoveManhwaToUserUseCase()

    const manhwaID = manhwa_id

    const { userManhwa } = await removeManhwaToUserUseCase.execute({
      user_id: request.user.sub,
      manhwaID,
    })

    return reply.status(201).send({ userManhwa })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
