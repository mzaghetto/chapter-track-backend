import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeDeleteProviderUseCase } from '@/use-cases/factories/make-delete-provider-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'

export async function deleteProvider(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteProviderParamsSchema = z.object({
    providerId: z.coerce.bigint(),
  })

  const { providerId } = deleteProviderParamsSchema.parse(request.params)

  try {
    const deleteProviderUseCase = makeDeleteProviderUseCase()

    await deleteProviderUseCase.execute({
      providerId,
    })

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
