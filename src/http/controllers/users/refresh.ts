import { FastifyReply, FastifyRequest } from 'fastify'
import { refreshTokenCookieOptions } from '@/http/utils/refresh-token-cookie-options'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify({ onlyCookie: true })
  } catch {
    return reply.status(401).send({ message: 'Unauthorized.' })
  }

  const { role } = request.user

  const token = await reply.jwtSign(
    { role },
    {
      sub: request.user.sub,
      expiresIn: '15m',
    },
  )

  const refreshToken = await reply.jwtSign(
    { role },
    {
      sub: request.user.sub,
      expiresIn: '7d',
    },
  )

  return reply
    .setCookie('refreshToken', refreshToken, refreshTokenCookieOptions)
    .status(200)
    .send({ token })
}
