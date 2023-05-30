import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { register } from './register'
import { FastifyInstance } from 'fastify'
import { refresh } from './refresh'
import { updateProfile } from './update-profile'
import { addManhwaToUser } from './add-manhwa-to-user'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/register', register)
  app.post('/sessions', authenticate)

  app.get('/me', { onRequest: [verifyJWT] }, profile)
  app.patch('/me', { onRequest: [verifyJWT] }, updateProfile)

  app.patch('/token/refresh', refresh)

  app.post('/user/add-manhwa', { onRequest: [verifyJWT] }, addManhwaToUser)
}
