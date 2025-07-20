import { FastifyInstance } from 'fastify'
import { createProvider } from './create-provider'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { getProviders } from './get-providers'

export async function providerRoutes(app: FastifyInstance) {
  app.get('/providers', { onRequest: [verifyJWT] }, getProviders)
  app.post(
    '/provider/create',
    { onRequest: [verifyJWT, verifyUserRole('ADMIN')] },
    createProvider,
  )
}
