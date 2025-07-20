import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { makeGetUserManhwasUseCase } from '@/use-cases/factories/make-get-user-manhwas-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function userManhwas(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userManhwasBodySchema = z.object({
    page: z.coerce.number().optional().default(1),
    pageSize: z.coerce.number().optional().default(20),
  })

  const { page, pageSize } = userManhwasBodySchema.parse(request.query)

  try {
    const getManhwasOfUser = makeGetUserManhwasUseCase()

    const { userManhwas, total } = await getManhwasOfUser.execute({
      userId: BigInt(request.user.sub),
      page,
      pageSize,
    })

    return reply.status(200).send({
      userManhwas,
      total,
    })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
