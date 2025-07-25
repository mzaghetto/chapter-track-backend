import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import { ZodError } from 'zod'
import { env } from './env'
import { usersRoutes } from './http/controllers/users/routes'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import { manhwaRoutes } from './http/controllers/manhwa/routes'
import { providerRoutes } from './http/controllers/providers/routes'
import { manhwaProviderRoutes } from './http/controllers/manhwa-provider/routes'
import { telegramRoutes } from './http/controllers/telegram/routes'
import bigintSerializer from './plugins/bigint-serializer'

export const app = fastify()

app.register(fastifyCors, {
  origin: env.FRONTEND_URL ? [env.FRONTEND_URL, 'http://localhost:3000'] : '*',
  credentials: true,
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
})

app.register(fastifyCookie)
app.register(bigintSerializer)
app.register(usersRoutes)
app.register(manhwaRoutes)
app.register(providerRoutes)
app.register(manhwaProviderRoutes)
app.register(telegramRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'dev') {
    console.error(error)
  } else {
    // TODO: Here we should log to an external tool like DataDog / NewRelice / Sentry
  }

  return reply.status(500).send({ message: 'Internal server error' })
})
