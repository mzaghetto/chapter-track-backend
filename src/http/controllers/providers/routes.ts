import { FastifyInstance } from 'fastify'
import { createProvider } from './create-provider'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function providerRoutes(app: FastifyInstance) {
  app.post(
    '/provider/create',
    { onRequest: [verifyJWT, verifyUserRole('ADMIN')] },
    createProvider,
  )
}
