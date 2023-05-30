import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeRegisterManhwaUserUseCase } from '@/use-cases/factories/make-register-manhwa-use-case'
import { ManhwaAlreadyExistsError } from '@/use-cases/errors/manhwa-already-exists-error'

export async function createManhwa(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerManhwaBodySchema = z.object({
    name: z.string(),
    last_episode_released: z.number(),
    last_episode_notified: z.number(),
    available_read_url: z.array(z.string()),
    manhwa_thumb: z.string(),
    url_crawler: z.string().optional(),
    users_to_notify: z.array(z.string()),
  })

  const {
    name,
    last_episode_released,
    last_episode_notified,
    available_read_url,
    manhwa_thumb,
    url_crawler,
    users_to_notify,
  } = registerManhwaBodySchema.parse(request.body)

  try {
    const registerManhwaUseCase = makeRegisterManhwaUserUseCase()

    const { manhwa } = await registerManhwaUseCase.execute({
      name,
      last_episode_released,
      last_episode_notified,
      available_read_url,
      manhwa_thumb,
      url_crawler,
      users_to_notify,
    })

    return reply.status(201).send({ manhwa })
  } catch (error) {
    if (error instanceof ManhwaAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
