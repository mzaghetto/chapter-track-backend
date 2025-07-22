import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeGetManhwaByIdUseCase } from '@/use-cases/factories/make-get-manhwa-by-id-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'

export async function getManhwaById(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getManhwaByIdParamsSchema = z.object({
    manhwaId: z.coerce.bigint(),
  })

  const { manhwaId } = getManhwaByIdParamsSchema.parse(request.params)

  try {
    const getManhwaByIdUseCase = makeGetManhwaByIdUseCase()

    const { manhwa } = await getManhwaByIdUseCase.execute({
      manhwaId,
    })

    return reply.status(200).send({ manhwa })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
