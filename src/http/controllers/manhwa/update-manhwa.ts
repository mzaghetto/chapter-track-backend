import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { ManhwaAlreadyExistsError } from '@/use-cases/errors/manhwa-already-exists-error'
import { makeUpdateManhwaUseCase } from '@/use-cases/factories/make-update-manhwa-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'

export async function updateManhwa(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateManhwaParamsSchema = z.object({
    manhwaID: z.string().uuid(),
  })

  const updateManhwaBodySchema = z.object({
    name: z.string().optional(),
    last_episode_released: z.number().optional(),
    last_episode_notified: z.number().optional(),
    available_read_url: z.array(z.string()).optional(),
    manhwa_thumb: z.string().optional(),
    url_crawler: z.string().optional(),
  })

  const { manhwaID } = updateManhwaParamsSchema.parse(request.params)

  const {
    name,
    last_episode_released,
    last_episode_notified,
    available_read_url,
    manhwa_thumb,
    url_crawler,
  } = updateManhwaBodySchema.parse(request.body)

  try {
    const updateManhwaUseCase = makeUpdateManhwaUseCase()

    const data = {
      name,
      last_episode_released,
      last_episode_notified,
      available_read_url,
      manhwa_thumb,
      url_crawler,
    }

    const { manhwa } = await updateManhwaUseCase.execute({ manhwaID, data })

    return reply.status(201).send({ manhwa })
  } catch (error) {
    if (error instanceof ManhwaAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
