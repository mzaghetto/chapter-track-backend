import { makeTriggerManhwaNotificationUseCase } from '@/use-cases/factories/make-trigger-manhwa-notification-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function triggerNotification(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const triggerNotificationBodySchema = z.object({
    manhwaId: z.coerce.bigint(),
    newEpisodeNumber: z.number(),
  })

  const { manhwaId, newEpisodeNumber } = triggerNotificationBodySchema.parse(
    request.body,
  )

  const triggerManhwaNotificationUseCase =
    makeTriggerManhwaNotificationUseCase()

  await triggerManhwaNotificationUseCase.execute({
    manhwaId,
    newEpisodeNumber,
  })

  return reply.status(204).send()
}
