import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeUpdateUserProfileUseCase } from '@/use-cases/factories/make-update-user-profile-use-case'
import { makeFindUserByTelegramLinkingTokenUseCase } from '@/use-cases/factories/make-find-user-by-telegram-linking-token-use-case'
import { TelegramService } from '@/services/telegram-service'

export async function telegramWebhook(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const webhookBodySchema = z.object({
    message: z.object({
      chat: z.object({
        id: z.number(),
      }),
      text: z.string(),
    }),
  })

  const { message } = webhookBodySchema.parse(request.body)

  if (message.text.startsWith('/start')) {
    const parts = message.text.split(' ')
    const token = parts[1]

    if (token) {
      const findUserByTelegramLinkingTokenUseCase =
        makeFindUserByTelegramLinkingTokenUseCase()
      const updateUserProfileUseCase = makeUpdateUserProfileUseCase()
      const telegramService = new TelegramService()

      try {
        const { user } = await findUserByTelegramLinkingTokenUseCase.execute({
          token,
        })

        await updateUserProfileUseCase.execute({
          userID: BigInt(user.id),
          data: {
            telegramId: message.chat.id.toString(),
            telegramActive: true,
            telegramLinkingToken: null, // Clear the token after successful linking
          },
        })

        await telegramService.sendMessage(
          message.chat.id.toString(),
          `Hello ${user.name}! Your account has been successfully linked to Telegram.`,
        )
      } catch (error) {
        console.error('Error linking Telegram account:', error)
        await telegramService.sendMessage(
          message.chat.id.toString(),
          'There was an error linking your account. Please try again or contact support.',
        )
      }
    } else {
      await new TelegramService().sendMessage(
        message.chat.id.toString(),
        'Please provide a linking token with the /start command. Example: /start your-token',
      )
    }
  }

  return reply.status(200).send()
}
