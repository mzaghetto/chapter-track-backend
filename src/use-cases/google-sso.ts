import { UsersRepository } from '@/repositories/users-repository'
import { Users } from '@prisma/client'
import { OAuth2Client } from 'google-auth-library'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { InvalidGoogleTokenError } from './errors/invalid-google-token-error'
import { UnverifiedGoogleEmailError } from './errors/unverified-google-email-error'

interface GoogleSSOUseCaseRequest {
  token: string
}

interface GoogleSSOUseCaseResponse {
  user: Users
}

export class GoogleSSOUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    token,
  }: GoogleSSOUseCaseRequest): Promise<GoogleSSOUseCaseResponse> {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    let payload

    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      })

      payload = ticket.getPayload()
    } catch (error) {
      throw new InvalidGoogleTokenError()
    }

    if (!payload) {
      throw new InvalidGoogleTokenError()
    }

    if (!payload.email_verified) {
      throw new UnverifiedGoogleEmailError()
    }

    let user = await this.usersRepository.findByGoogleId(payload.sub)

    if (!user) {
      user = await this.usersRepository.findByEmail(payload.email!)

      if (!user) {
        user = await this.usersRepository.create({
          name: payload.name!,
          email: payload.email!,
          googleId: payload.sub,
          username: payload.email!,
          password_hash: 'google-sso-placeholder',
        })
      } else {
        const updatedUser = await this.usersRepository.findByIDAndUpdate(
          user.id,
          {
            googleId: payload.sub,
          },
        )

        if (!updatedUser) {
          throw new ResourceNotFoundError()
        }
        user = updatedUser
      }
    }

    return {
      user,
    }
  }
}
