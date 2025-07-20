import { FastifyReply, FastifyRequest } from 'fastify'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { makeGetUnreadManhwasUseCase } from '@/use-cases/factories/make-get-unread-manhwas-use-case'

export async function unreadManhwas(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const unreadManhwasUserUseCase = makeGetUnreadManhwasUseCase()

    const { unreadManhwas } = await unreadManhwasUserUseCase.execute({
      userId: BigInt(request.user.sub),
    })

    return reply.status(200).send({ unreadManhwas })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
