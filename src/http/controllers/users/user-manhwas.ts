import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { makeGetUserManhwasUseCase } from '@/use-cases/factories/make-get-user-manhwas-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function userManhwas(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userManhwasBodySchema = z.object({
    page: z.number().optional(),
  })

  const { page } = userManhwasBodySchema.parse(request.params)

  try {
    const getManhwasOfUser = makeGetUserManhwasUseCase()

    const { userManhwa } = await getManhwasOfUser.execute({
      userID: request.user.sub,
      page,
    })

    return reply.status(200).send({
      userManhwa,
    })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
