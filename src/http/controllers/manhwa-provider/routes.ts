import { FastifyInstance } from 'fastify'
import { createManhwaProvider } from './create-manhwa-provider'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function manhwaProviderRoutes(app: FastifyInstance) {
  app.post(
    '/manhwa-provider/create',
    { onRequest: [verifyJWT, verifyUserRole('ADMIN')] },
    createManhwaProvider,
  )
}
