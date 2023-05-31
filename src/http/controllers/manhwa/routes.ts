import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { createManhwa } from './create-manhwa'
import { updateManhwa } from './update-manhwa'

export async function manhwaRoutes(app: FastifyInstance) {
  app.post('/manhwa/create', { onRequest: [verifyJWT] }, createManhwa)

  app.patch(
    '/manhwa/:manhwaID/update',
    { onRequest: [verifyJWT] },
    updateManhwa,
  )
}
