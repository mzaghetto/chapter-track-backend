import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeGoogleSSOUseCase } from '@/use-cases/factories/make-google-sso-use-case'
import { InvalidGoogleTokenError } from '@/use-cases/errors/invalid-google-token-error'
import { UnverifiedGoogleEmailError } from '@/use-cases/errors/unverified-google-email-error'

export async function googleSSO(request: FastifyRequest, reply: FastifyReply) {
  const googleSSOBodySchema = z.object({
    token: z.string(),
  })

  const { token } = googleSSOBodySchema.parse(request.body)

  try {
    const googleSSOUseCase = makeGoogleSSOUseCase()

    const { user } = await googleSSOUseCase.execute({ token })

    const authToken = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sub: user.id.toString(),
        expiresIn: '10m',
      },
    )

    const refreshToken = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sub: user.id.toString(),
        expiresIn: '7d',
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token: authToken })
  } catch (error) {
    if (error instanceof InvalidGoogleTokenError) {
      return reply.status(401).send({ message: error.message })
    }

    if (error instanceof UnverifiedGoogleEmailError) {
      return reply.status(403).send({ message: error.message })
    }

    throw error
  }
}
