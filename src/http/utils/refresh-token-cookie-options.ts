import { env } from '@/env'

export const refreshTokenCookieOptions = {
  path: '/',
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  httpOnly: true,
} as const
