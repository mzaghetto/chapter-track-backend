import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeFilterManhwaByNameToUserUseCase } from '@/use-cases/factories/make-filter-manhwa-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'

export async function filterManhwa(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const filterManhwaParamsSchema = z.object({
    page: z
      .string()
      .optional()
      .refine(
        (value) => {
          if (value === undefined) {
            return true
          }
          const parsedValue = parseInt(value, 10)
          return !isNaN(parsedValue)
        },
        {
          message: 'Expected number, received string',
        },
      ),
    limit: z
      .string()
      .optional()
      .refine(
        (value) => {
          if (value === undefined) {
            return true
          }
          const parsedValue = parseInt(value, 10)
          return !isNaN(parsedValue)
        },
        {
          message: 'Expected number, received string',
        },
      ),
    sort: z.enum(['asc', 'desc']).optional(),
    manhwaName: z.string(),
  })

  const { manhwaName, page, limit, sort } = filterManhwaParamsSchema.parse(
    request.query,
  )
  const params = { page, limit, sort }

  try {
    const filterManhwaByNameToUserUseCase =
      makeFilterManhwaByNameToUserUseCase()

    const manhwa = await filterManhwaByNameToUserUseCase.execute({
      nameToFilter: manhwaName,
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
