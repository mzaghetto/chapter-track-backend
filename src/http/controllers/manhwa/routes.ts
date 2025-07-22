import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { createManhwa } from './create-manhwa'
import { updateManhwa } from './update-manhwa'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { filterManhwa } from './filter-manhwa'
import { triggerNotification } from './trigger-notification'
import { deleteManhwa } from './delete-manhwa'
import { getManhwaById } from './get-manhwa-by-id'

export async function manhwaRoutes(app: FastifyInstance) {
  app.post(
    '/manhwa/create',
    { onRequest: [verifyJWT, verifyUserRole('ADMIN')] },
    createManhwa,
  )

  app.get('/manhwa/list', { onRequest: [verifyJWT] }, filterManhwa)

  app.patch(
    '/manhwa/:manhwaID/update',
    { onRequest: [verifyJWT, verifyUserRole('ADMIN')] },
    updateManhwa,
  )

  app.post(
    '/manhwa/trigger-notification',
    { onRequest: [verifyJWT, verifyUserRole('ADMIN')] },
    triggerNotification,
  )

  app.delete(
    '/manhwa/:manhwaId',
    { onRequest: [verifyJWT, verifyUserRole('ADMIN')] },
    deleteManhwa,
  )

  app.get('/manhwa/:manhwaId', { onRequest: [verifyJWT] }, getManhwaById)
}
