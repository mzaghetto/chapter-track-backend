import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeCreateProviderUseCase } from '@/use-cases/factories/make-create-provider-use-case'
import { transformProviderResponse } from '@/utils/bigint-transformer'

export async function createProvider(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createProviderBodySchema = z.object({
    name: z.string(),
    url: z.string().url().optional().nullable(),
  })

  const { name, url } = createProviderBodySchema.parse(request.body)

  try {
    const createProviderUseCase = makeCreateProviderUseCase()

    const { provider } = await createProviderUseCase.execute({
      name,
      url,
    })

    return reply
      .status(201)
      .send({ provider: transformProviderResponse(provider) })
  } catch (error) {
    console.log(error)
    // TODO: Add specific error handling for provider creation
    throw error
  }
}
