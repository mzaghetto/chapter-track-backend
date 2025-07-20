import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeCreateManhwaProviderUseCase } from '@/use-cases/factories/make-create-manhwa-provider-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'

export async function createManhwaProvider(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createManhwaProviderBodySchema = z.object({
    manhwaId: z.coerce.bigint(),
    providerId: z.coerce.bigint(),
    lastEpisodeReleased: z.coerce.number().optional().nullable(),
    url: z.string().url().optional().nullable(),
  })

  const { manhwaId, providerId, lastEpisodeReleased, url } =
    createManhwaProviderBodySchema.parse(request.body)

  try {
    const createManhwaProviderUseCase = makeCreateManhwaProviderUseCase()

    const { manhwaProvider } = await createManhwaProviderUseCase.execute({
      manhwaId,
      providerId,
      lastEpisodeReleased,
      url,
    })

    return reply.status(201).send({ manhwaProvider })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }
    throw error
  }
}
