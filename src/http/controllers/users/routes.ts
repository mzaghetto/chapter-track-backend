import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { register } from './register'
import { FastifyInstance } from 'fastify'
import { refresh } from './refresh'
import { updateProfile } from './update-profile'
import { addManhwaToUser } from './add-manhwa-to-user'
import { removeManhwaToUser } from './remove-manhwa-to-user'
import { userManhwas } from './user-manhwas'
import { unreadManhwas } from './unread-manhwas'
import { telegramNotification } from './telegram-notification'
import { googleSSO } from './google-sso'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/register', register)
  app.post('/sessions', authenticate)
  app.post('/sso/google', googleSSO)

  app.get('/me', { onRequest: [verifyJWT] }, profile)
  app.patch('/me', { onRequest: [verifyJWT] }, updateProfile)

  app.patch('/token/refresh', refresh)

  app.get('/user/manhwas', { onRequest: [verifyJWT] }, userManhwas)
  app.get('/user/manhwas/unread', { onRequest: [verifyJWT] }, unreadManhwas)
  app.post('/user/add-manhwa', { onRequest: [verifyJWT] }, addManhwaToUser)
  app.delete(
    '/user/remove-manhwa',
    { onRequest: [verifyJWT] },
    removeManhwaToUser,
  )

  app.patch(
    '/user/telegram-notification',
    { onRequest: [verifyJWT] },
    telegramNotification,
  )
}
