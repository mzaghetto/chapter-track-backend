import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { ManhwaAlreadyExistsError } from '@/use-cases/errors/manhwa-already-exists-error'
import { makeUpdateManhwaUseCase } from '@/use-cases/factories/make-update-manhwa-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'

export async function updateManhwa(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateManhwaParamsSchema = z.object({
    manhwaID: z.coerce.bigint(),
  })

  const updateManhwaBodySchema = z.object({
    name: z.string().optional(),
    author: z.string().optional().nullable(),
    genre: z.any().optional().nullable(),
    coverImage: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    status: z.enum(['ONGOING', 'COMPLETED', 'HIATUS']).optional().nullable(),
  })

  const { manhwaID } = updateManhwaParamsSchema.parse(request.params)

  const { name, author, genre, coverImage, description, status } =
    updateManhwaBodySchema.parse(request.body)

  try {
    const updateManhwaUseCase = makeUpdateManhwaUseCase()

    const data = {
      name,
      author,
      genre,
      coverImage,
      description,
      status,
    }

    const { manhwa } = await updateManhwaUseCase.execute({ manhwaID, data })

    return reply.status(201).send({ manhwa })
  } catch (error) {
    if (error instanceof ManhwaAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
