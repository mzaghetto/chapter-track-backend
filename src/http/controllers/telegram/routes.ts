import { FastifyInstance } from 'fastify'
import { telegramWebhook } from './webhook'

export async function telegramRoutes(app: FastifyInstance) {
  app.post('/telegram/webhook', telegramWebhook)
}
