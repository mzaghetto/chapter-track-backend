import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { ManhwaAlreadyExistsError } from '@/use-cases/errors/manhwa-already-exists-error'
import { makeRegisterManhwaToUserUseCase } from '@/use-cases/factories/make-register-manhwa-to-user-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'

export async function addManhwaToUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerManhwaToUserBodySchema = z.object({
    manhwa_id: z.string(),
    manhwa_position: z.number(),
    last_episode_read: z.number(),
    read_url: z.array(z.string()),
    notify_telegram: z.boolean(),
    notification_website: z.boolean(),
  })

  const {
    manhwa_id,
    manhwa_position,
    last_episode_read,
    read_url,
    notify_telegram,
    notification_website,
  } = registerManhwaToUserBodySchema.parse(request.body)

  try {
    const registerManhwaToUserUseCase = makeRegisterManhwaToUserUseCase()

    const manhwas = {
      manhwa_id,
      manhwa_position,
      last_episode_read,
      read_url,
      notify_telegram,
      notification_website,
    }

    const { userManhwa } = await registerManhwaToUserUseCase.execute({
      user_id: request.user.sub,
      manhwas,
    })

    return reply.status(201).send({ userManhwa })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(400).send({ message: error.message })
    }

    if (error instanceof ManhwaAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
