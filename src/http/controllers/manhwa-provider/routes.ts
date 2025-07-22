import { FastifyInstance } from 'fastify'
import { createManhwaProvider } from './create-manhwa-provider'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { getManhwaProviders } from './get-manhwa-providers'
import { deleteProvider } from './delete-provider'

export async function manhwaProviderRoutes(app: FastifyInstance) {
  app.get('/manhwa-providers', { onRequest: [verifyJWT] }, getManhwaProviders)
  app.post(
    '/manhwa-provider/create',
    { onRequest: [verifyJWT, verifyUserRole('ADMIN')] },
    createManhwaProvider,
  )
  app.delete(
    '/manhwa-provider/:providerId',
    { onRequest: [verifyJWT, verifyUserRole('ADMIN')] },
    deleteProvider,
  )
}
