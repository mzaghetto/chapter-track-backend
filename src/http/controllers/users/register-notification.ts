import { makeRegisterUserNotificationUseCase } from '@/use-cases/factories/make-register-user-notification-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { NotificationChannel } from '@prisma/client'

export async function registerNotification(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerNotificationBodySchema = z.object({
    manhwaId: z.coerce.bigint(),
    channel: z.nativeEnum(NotificationChannel),
    isEnabled: z.boolean(),
  })

  const { manhwaId, channel, isEnabled } = registerNotificationBodySchema.parse(
    request.body,
  )

  const registerUserNotificationUseCase = makeRegisterUserNotificationUseCase()

  const { userNotification } = await registerUserNotificationUseCase.execute({
    userId: BigInt(request.user.sub),
    manhwaId,
    channel,
    isEnabled,
  })

  return reply.status(201).send({
    userNotification: {
      manhwaId: userNotification.manhwaId,
      channel: userNotification.channel,
      isEnabled: userNotification.isEnabled,
    },
  })
}
