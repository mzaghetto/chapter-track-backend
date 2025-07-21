import { makeGenerateTelegramLinkingTokenUseCase } from '@/use-cases/factories/make-generate-telegram-linking-token-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function generateTelegramLinkingToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const generateTelegramLinkingTokenUseCase =
    makeGenerateTelegramLinkingTokenUseCase()

  const { user } = await generateTelegramLinkingTokenUseCase.execute({
    userId: BigInt(request.user.sub),
  })

  return reply.status(200).send({
    telegramLinkingToken: user.telegramLinkingToken,
  })
}
