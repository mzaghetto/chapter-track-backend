import { expect, describe, it, beforeEach, vi } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GoogleSSOUseCase } from './google-sso'
import { InvalidGoogleTokenError } from './errors/invalid-google-token-error'
import { UnverifiedGoogleEmailError } from './errors/unverified-google-email-error'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { makeUser } from './test/make-user'

let usersRepository: InMemoryUsersRepository
let sut: GoogleSSOUseCase

vi.mock('google-auth-library', () => {
  const OAuth2Client = vi.fn()
  OAuth2Client.prototype.verifyIdToken = vi.fn()
  return { OAuth2Client }
})

describe('Google SSO Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GoogleSSOUseCase(usersRepository)
  })

  it('should be able to authenticate with a valid google token', async () => {
    const { OAuth2Client } = await import('google-auth-library')
    const mockVerifyIdToken = OAuth2Client.prototype
      .verifyIdToken as ReturnType<typeof vi.fn>

    mockVerifyIdToken.mockResolvedValue({
      getPayload: () => ({
        sub: 'google-user-id',
        name: 'Jhon Doe',
        email: 'johndoe@example.com',
        email_verified: true,
      }),
    })

    const { user } = await sut.execute({ token: 'valid-token' })

    expect(user.email).toEqual('johndoe@example.com')
    expect(user.googleId).toEqual('google-user-id')
  })

  it('should link google id to an existing user with the same email', async () => {
    const userData = makeUser({
      email: 'johndoe@example.com',
    })
    await usersRepository.create(userData)

    const { OAuth2Client } = await import('google-auth-library')
    const mockVerifyIdToken = OAuth2Client.prototype
      .verifyIdToken as ReturnType<typeof vi.fn>

    mockVerifyIdToken.mockResolvedValue({
      getPayload: () => ({
        sub: 'google-user-id',
        name: 'Jhon Doe',
        email: 'johndoe@example.com',
        email_verified: true,
      }),
    })

    const { user } = await sut.execute({ token: 'valid-token' })

    expect(user.email).toEqual('johndoe@example.com')
    expect(user.googleId).toEqual('google-user-id')
  })

  it('should not be able to authenticate with an invalid google token', async () => {
    const { OAuth2Client } = await import('google-auth-library')
    const mockVerifyIdToken = OAuth2Client.prototype
      .verifyIdToken as ReturnType<typeof vi.fn>

    mockVerifyIdToken.mockRejectedValue(new Error())

    await expect(
      sut.execute({ token: 'invalid-token' }),
    ).rejects.toBeInstanceOf(InvalidGoogleTokenError)
  })

  it('should not be able to authenticate with an unverified email', async () => {
    const { OAuth2Client } = await import('google-auth-library')
    const mockVerifyIdToken = OAuth2Client.prototype
      .verifyIdToken as ReturnType<typeof vi.fn>

    mockVerifyIdToken.mockResolvedValue({
      getPayload: () => ({
        sub: 'google-user-id',
        name: 'Jhon Doe',
        email: 'johndoe@example.com',
        email_verified: false,
      }),
    })

    await expect(sut.execute({ token: 'valid-token' })).rejects.toBeInstanceOf(
      UnverifiedGoogleEmailError,
    )
  })

  it('should throw an error if payload is null', async () => {
    const { OAuth2Client } = await import('google-auth-library')
    const mockVerifyIdToken = OAuth2Client.prototype
      .verifyIdToken as ReturnType<typeof vi.fn>

    mockVerifyIdToken.mockResolvedValue({
      getPayload: () => null,
    })

    await expect(sut.execute({ token: 'valid-token' })).rejects.toBeInstanceOf(
      InvalidGoogleTokenError,
    )
  })

  it('should throw an error if findByIDAndUpdate returns null', async () => {
    const userData = makeUser({
      email: 'johndoe@example.com',
    })
    await usersRepository.create(userData)

    const { OAuth2Client } = await import('google-auth-library')
    const mockVerifyIdToken = OAuth2Client.prototype
      .verifyIdToken as ReturnType<typeof vi.fn>

    mockVerifyIdToken.mockResolvedValue({
      getPayload: () => ({
        sub: 'google-user-id',
        name: 'Jhon Doe',
        email: 'johndoe@example.com',
        email_verified: true,
      }),
    })

    vi.spyOn(usersRepository, 'findByIDAndUpdate').mockResolvedValueOnce(null)

    await expect(sut.execute({ token: 'valid-token' })).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    )
  })

  it('should find a user by google id', async () => {
    const userData = makeUser({
      email: 'johndoe@example.com',
      googleId: 'google-user-id',
    })
    await usersRepository.create(userData)

    const { OAuth2Client } = await import('google-auth-library')
    const mockVerifyIdToken = OAuth2Client.prototype
      .verifyIdToken as ReturnType<typeof vi.fn>

    mockVerifyIdToken.mockResolvedValue({
      getPayload: () => ({
        sub: 'google-user-id',
        name: 'Jhon Doe',
        email: 'johndoe@example.com',
        email_verified: true,
      }),
    })

    const { user } = await sut.execute({ token: 'valid-token' })

    expect(user.googleId).toEqual('google-user-id')
  })
})
