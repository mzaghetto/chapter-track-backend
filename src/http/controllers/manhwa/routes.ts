import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { addManhwa } from './add-manhwa'

export async function manhwaRoutes(app: FastifyInstance) {
  app.post('/manhwa/add', { onRequest: [verifyJWT] }, addManhwa)
}
