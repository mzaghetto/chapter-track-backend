import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { createManhwa } from './create-manhwa'

export async function manhwaRoutes(app: FastifyInstance) {
  app.post('/manhwa/create', { onRequest: [verifyJWT] }, createManhwa)
}
