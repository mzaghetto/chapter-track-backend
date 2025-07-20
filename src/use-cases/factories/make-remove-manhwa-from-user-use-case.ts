import { PrismaUserManhwaRepository } from '@/repositories/prisma/prisma-user-manhwa-repository'
import { RemoveManhwaFromUserUseCase } from '../remove-manhwa-from-user'

export function makeRemoveManhwaFromUserUseCase() {
  const userManhwaRepository = new PrismaUserManhwaRepository()
  const removeManhwaFromUserUseCase = new RemoveManhwaFromUserUseCase(
    userManhwaRepository,
  )

  return removeManhwaFromUserUseCase
}
