import { makeUpdateUserManhwaUseCase } from '@/use-cases/factories/make-update-user-manhwa-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { UserManhwaStatus } from '@prisma/client'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'

export async function updateUserManhwa(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateUserManhwaParamsSchema = z.object({
    userManhwaId: z.coerce.bigint(),
  })

  const updateUserManhwaBodySchema = z.object({
    lastEpisodeRead: z.number().optional(),
    providerId: z.coerce.bigint().optional(),
    status: z.nativeEnum(UserManhwaStatus).optional(),
    order: z.number().optional(),
  })

  const { userManhwaId } = updateUserManhwaParamsSchema.parse(request.params)
  const { lastEpisodeRead, providerId, status, order } =
    updateUserManhwaBodySchema.parse(request.body)

  const updateUserManhwaUseCase = makeUpdateUserManhwaUseCase()

  try {
    const { userManhwa } = await updateUserManhwaUseCase.execute({
      userManhwaId,
      userId: BigInt(request.user.sub),
      data: {
        lastEpisodeRead,
        providerId,
        status,
        order,
      },
    })

    return reply.status(200).send({ userManhwa })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
