import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeDeleteManhwaUseCase } from '@/use-cases/factories/make-delete-manhwa-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'

export async function deleteManhwa(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteManhwaParamsSchema = z.object({
    manhwaId: z.coerce.bigint(),
  })

  const { manhwaId } = deleteManhwaParamsSchema.parse(request.params)

  try {
    const deleteManhwaUseCase = makeDeleteManhwaUseCase()

    await deleteManhwaUseCase.execute({
      manhwaId,
    })

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
