import { FastifyReply, FastifyRequest } from 'fastify'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { makeTelegramNotificationUseCase } from '@/use-cases/factories/make-telegram-notification-use-case'
import z from 'zod'
import { TelegramIDRequired } from '@/use-cases/errors/telegram-id-required'
import { TelegramService } from '@/services/telegram-service'
import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'

interface TelegramNotificationData {
  userId: bigint
  activate: boolean
  telegramId?: string
}

export async function telegramNotification(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const telegramNotificationBodySchema = z.object({
    activate: z.boolean(),
  })

  const { activate } = telegramNotificationBodySchema.parse(request.body)

  const telegramService = new TelegramService()

  try {
    const getUserProfileUseCase = makeGetUserProfileUseCase()
    const { user } = await getUserProfileUseCase.execute({
      userID: BigInt(request.user.sub),
    })

    const telegramId = user.telegramId

    const telegramNotificationUseCase = makeTelegramNotificationUseCase()

    const telegramNotificationData: TelegramNotificationData = {
      userId: BigInt(request.user.sub),
      activate,
    }

    if (telegramId) telegramNotificationData.telegramId = telegramId

    if (!activate && telegramId) {
      await telegramService.sendMessage(
        telegramId,
        'Your account has been successfully deactivated notifications from Telegram.',
      )
    }

    const telegramNotificationResponse =
      await telegramNotificationUseCase.execute({
        userId: BigInt(request.user.sub),
        telegramId: telegramId ?? undefined,
        activate,
      })

    return reply
      .status(200)
      .send({ activate: telegramNotificationResponse.activate })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    if (error instanceof TelegramIDRequired) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
