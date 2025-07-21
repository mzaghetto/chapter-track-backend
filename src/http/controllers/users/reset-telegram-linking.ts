import { makeUpdateUserProfileUseCase } from '@/use-cases/factories/make-update-user-profile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function resetTelegramLinking(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateUserProfileUseCase = makeUpdateUserProfileUseCase()

  await updateUserProfileUseCase.execute({
    userID: BigInt(request.user.sub),
    data: {
      telegramId: null,
      telegramActive: false,
      telegramLinkingToken: null,
    },
  })

  return reply.status(204).send()
}
