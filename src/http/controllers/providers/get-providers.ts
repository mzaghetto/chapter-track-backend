import { makeGetProvidersUseCase } from '@/use-cases/factories/make-get-providers-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function getProviders(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getProvidersQuerySchema = z.object({
    searchTerm: z.string().optional(),
  })

  const { searchTerm } = getProvidersQuerySchema.parse(request.query)

  const getProvidersUseCase = makeGetProvidersUseCase()

  const { providers } = await getProvidersUseCase.execute({ searchTerm })

  return reply.status(200).send({ providers })
}
