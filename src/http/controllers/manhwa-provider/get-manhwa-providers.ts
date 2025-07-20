import { makeGetManhwaProvidersUseCase } from '@/use-cases/factories/make-get-manhwa-providers-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getManhwaProviders(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getManhwaProvidersQuerySchema = z.object({
    manhwaId: z.coerce.bigint().optional(),
    providerId: z.coerce.bigint().optional(),
    manhwaName: z.string().optional(),
    providerName: z.string().optional(),
  })

  const { manhwaId, providerId, manhwaName, providerName } =
    getManhwaProvidersQuerySchema.parse(request.query)

  const getManhwaProvidersUseCase = makeGetManhwaProvidersUseCase()

  const { manhwaProviders } = await getManhwaProvidersUseCase.execute({
    manhwaId,
    providerId,
    manhwaName,
    providerName,
  })

  return reply.status(200).send({ manhwaProviders })
}
