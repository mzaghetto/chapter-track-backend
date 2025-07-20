import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { Prisma } from '@prisma/client'
import { makeRegisterManhwaUserUseCase } from '@/use-cases/factories/make-register-manhwa-use-case'
import { ManhwaAlreadyExistsError } from '@/use-cases/errors/manhwa-already-exists-error'
import { transformManhwaResponse } from '@/utils/bigint-transformer'

export async function createManhwa(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerManhwaBodySchema = z.object({
    name: z.string(),
    author: z.string().optional().nullable(),
    genre: z.array(z.string()).optional().nullable(),
    coverImage: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    status: z.enum(['ONGOING', 'COMPLETED', 'HIATUS']).optional().nullable(),
  })

  const { name, author, genre, coverImage, description, status } =
    registerManhwaBodySchema.parse(request.body)

  try {
    const registerManhwaUseCase = makeRegisterManhwaUserUseCase()

    const { manhwa } = await registerManhwaUseCase.execute({
      name,
      author,
      genre: genre as Prisma.InputJsonValue,
      coverImage,
      description,
      status,
    })

    return reply.status(201).send({ manhwa: transformManhwaResponse(manhwa) })
  } catch (error) {
    if (error instanceof ManhwaAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
