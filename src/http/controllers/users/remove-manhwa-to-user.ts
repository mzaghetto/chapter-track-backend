import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { makeRemoveManhwaFromUserUseCase } from '@/use-cases/factories/make-remove-manhwa-from-user-use-case'

export async function removeManhwaToUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const removeManhwaToUserBodySchema = z.object({
    manhwaId: z.coerce.bigint(),
  })

  const { manhwaId } = removeManhwaToUserBodySchema.parse(request.body)

  try {
    const removeManhwaFromUserUseCase = makeRemoveManhwaFromUserUseCase()

    await removeManhwaFromUserUseCase.execute({
      userId: BigInt(request.user.sub),
      manhwaId,
    })

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
