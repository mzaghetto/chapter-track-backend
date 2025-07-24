import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetRandomManhwasUseCase } from '../../../use-cases/factories/make-get-random-manhwas-use-case'

export async function manhwaRandom(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const randomQuerySchema = z.object({
    count: z.coerce.number().default(10),
  })

  const { count } = randomQuerySchema.parse(request.query)

  const getRandomManhwasUseCase = makeGetRandomManhwasUseCase()

  const { manhwas } = await getRandomManhwasUseCase.execute({ count })

  return reply.status(200).send({
    manhwas,
  })
}
