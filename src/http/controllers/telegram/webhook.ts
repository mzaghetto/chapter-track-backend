import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeUpdateUserTelegramUseCase } from '@/use-cases/factories/make-update-user-telegram-use-case'
import { makeFindUserByTelegramLinkingTokenUseCase } from '@/use-cases/factories/make-find-user-by-telegram-linking-token-use-case'
import { TelegramService } from '@/services/telegram-service'

export async function telegramWebhook(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  console.log('Telegram Webhook received:', request.body)
  let message
  try {
    const webhookBodySchema = z.object({
      message: z.object({
        chat: z.object({
          id: z.number(),
        }),
        text: z.string(),
      }),
    })
    message = webhookBodySchema.parse(request.body).message
  } catch (error) {
    console.error('Error parsing webhook body:', error)
    return reply.status(400).send({ message: 'Invalid webhook body.' })
  }

  if (message.text.startsWith('/start')) {
    const parts = message.text.split(' ')
    const token = parts[1]

    if (token) {
      const findUserByTelegramLinkingTokenUseCase =
        makeFindUserByTelegramLinkingTokenUseCase()
      const updateUserTelegramUseCase = makeUpdateUserTelegramUseCase()
      const telegramService = new TelegramService()

      try {
        const { user } = await findUserByTelegramLinkingTokenUseCase.execute({
          token,
        })

        await updateUserTelegramUseCase.execute({
          userId: BigInt(user.id),
          telegramId: message.chat.id.toString(),
          telegramActive: true,
          telegramLinkingToken: null,
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
