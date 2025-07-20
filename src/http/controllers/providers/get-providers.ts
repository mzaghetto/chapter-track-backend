import { makeGetProvidersUseCase } from '@/use-cases/factories/make-get-providers-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getProviders(request: FastifyRequest, reply: FastifyReply) {
  const getProvidersUseCase = makeGetProvidersUseCase()

  const { providers } = await getProvidersUseCase.execute()

  return reply.status(200).send({ providers })
}
