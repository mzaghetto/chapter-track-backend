import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeFilterManhwaByNameToUserUseCase } from '@/use-cases/factories/make-filter-manhwa-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'

export async function filterManhwa(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const filterManhwaParamsSchema = z.object({
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
    sort: z.enum(['asc', 'desc']).optional(),
    manhwaName: z.string().optional(),
    genre: z.string().optional(),
    status: z.enum(['ONGOING', 'COMPLETED', 'HIATUS']).optional(),
  })

  const { manhwaName, page, limit, sort, genre, status } =
    filterManhwaParamsSchema.parse(request.query)

  const params = { page, limit, sort }

  try {
    const filterManhwaByNameToUserUseCase =
      makeFilterManhwaByNameToUserUseCase()

    const manhwa = await filterManhwaByNameToUserUseCase.execute({
      nameToFilter: manhwaName,
      genre,
      status,
      params,
    })

    return reply.status(200).send(manhwa)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
