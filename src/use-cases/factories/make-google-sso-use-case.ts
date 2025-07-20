import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GoogleSSOUseCase } from '@/use-cases/user/google-sso'

export function makeGoogleSSOUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const googleSSOUseCase = new GoogleSSOUseCase(usersRepository)

  return googleSSOUseCase
}
