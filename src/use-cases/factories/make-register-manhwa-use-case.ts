import { RegisterManhwaUseCase } from '../register-manhwa'
import { PrismaManhwasRepository } from '@/repositories/prisma/prisma-manhwas-repository'

export function makeRegisterManhwaUserUseCase() {
  const manhwaRepository = new PrismaManhwasRepository()
  const registerManhwaUseCase = new RegisterManhwaUseCase(manhwaRepository)

  return registerManhwaUseCase
}
