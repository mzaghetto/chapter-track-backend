import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { ManhwaAlreadyExistsError } from '@/use-cases/errors/manhwa-already-exists-error'
import { makeAddManhwaToUserUseCase } from '@/use-cases/factories/make-add-manhwa-to-user-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { UserManhwaStatus } from '@prisma/client'
import { transformUserManhwaResponse } from '@/utils/bigint-transformer'

export async function addManhwaToUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerManhwaToUserBodySchema = z.object({
    manhwaId: z.coerce.bigint(),
    providerId: z.coerce.bigint().optional(),
    status: z.nativeEnum(UserManhwaStatus).optional(),
    lastEpisodeRead: z.number().optional(),
    order: z.number(),
  })

  const { manhwaId, providerId, status, lastEpisodeRead, order } =
    registerManhwaToUserBodySchema.parse(request.body)

  try {
    const addManhwaToUserUseCase = makeAddManhwaToUserUseCase()

    const { userManhwa } = await addManhwaToUserUseCase.execute({
      userId: BigInt(request.user.sub),
      manhwaId,
      providerId,
      status,
      lastEpisodeRead,
      order,
    })

    return reply
      .status(201)
      .send({ userManhwa: transformUserManhwaResponse(userManhwa) })
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
