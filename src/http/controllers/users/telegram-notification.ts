import { FastifyReply, FastifyRequest } from 'fastify'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { makeTelegramNotificationUseCase } from '@/use-cases/factories/make-telegram-notification-use-case'
import z from 'zod'
import { TelegramIDRequired } from '@/use-cases/errors/telegram-id-required'

interface TelegramNotificationData {
  userID: string
  activate: boolean
  telegramID?: string // Propriedade opcional
}

export async function telegramNotification(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const telegramNotificationBodySchema = z.object({
    telegramID: z.string().optional(),
    activate: z.boolean(),
  })

  const { telegramID, activate } = telegramNotificationBodySchema.parse(
    request.body,
  )

  try {
    const telegramNotificationUseCase = makeTelegramNotificationUseCase()

    const telegramNotificationData: TelegramNotificationData = {
      userID: request.user.sub,
      activate,
    }

    if (telegramID) telegramNotificationData.telegramID = telegramID

    const telegramNotificationResponse =
      await telegramNotificationUseCase.execute({
        userID: request.user.sub,
        telegramID,
        activate,
      })

    return reply
      .status(200)
      .send({ acivate: telegramNotificationResponse.activate })
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
