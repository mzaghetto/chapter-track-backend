import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { createManhwa } from './create-manhwa'
import { updateManhwa } from './update-manhwa'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function manhwaRoutes(app: FastifyInstance) {
  app.post(
    '/manhwa/create',
    { onRequest: [verifyJWT, verifyUserRole('admin')] },
    createManhwa,
  )

  app.patch(
    '/manhwa/:manhwaID/update',
    { onRequest: [verifyJWT, verifyUserRole('admin')] },
    updateManhwa,
  )
}
