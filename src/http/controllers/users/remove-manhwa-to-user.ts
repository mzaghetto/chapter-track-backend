import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { makeRemoveManhwaToUserUseCase } from '@/use-cases/factories/make-remove-manhwa-to-user-use-case'

export async function removeManhwaToUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const removeManhwaToUserBodySchema = z.object({
    manhwa_id: z.string().array(),
  })

  const { manhwa_id } = removeManhwaToUserBodySchema.parse(request.body)

  try {
    const removeManhwaToUserUseCase = makeRemoveManhwaToUserUseCase()

    const manhwasID = manhwa_id

    const { userManhwa } = await removeManhwaToUserUseCase.execute({
      user_id: request.user.sub,
      manhwasID,
    })

    return reply.status(200).send({ userManhwa })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
