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
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).default(10),
  })

  const { manhwaId, providerId, manhwaName, providerName, page, pageSize } =
    getManhwaProvidersQuerySchema.parse(request.query)

  const getManhwaProvidersUseCase = makeGetManhwaProvidersUseCase()

  const { manhwaProviders, totalCount } =
    await getManhwaProvidersUseCase.execute({
      manhwaId,
      providerId,
      manhwaName,
      providerName,
      page,
      pageSize,
    })

  return reply.status(200).send({
    manhwaProviders,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  })
}
