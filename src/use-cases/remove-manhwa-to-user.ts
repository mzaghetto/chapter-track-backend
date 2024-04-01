import { UserManhwaRepository } from '@/repositories/user-manhwa-repository'
import { UserManhwa } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { ManhwasRepository } from '@/repositories/manhwas-repository'

interface RemoveManhwaToUserManhwaUseCaseRequest {
  user_id: string
  manhwasID: string[]
}

interface RemoveManhwaToUserManhwaUseCaseReponse {
  userManhwa: UserManhwa
}

export class RemoveManhwaToUserManhwaUseCase {
  constructor(
    private userManhwaRepository: UserManhwaRepository,
    private manhwaRepository: ManhwasRepository,
  ) {}

  async execute({
    user_id,
    manhwasID,
  }: RemoveManhwaToUserManhwaUseCaseRequest): Promise<RemoveManhwaToUserManhwaUseCaseReponse> {
    const manhwaExists = await this.manhwaRepository.findByIDs(manhwasID)

    if (!manhwaExists) {
      throw new ResourceNotFoundError()
    }

    const userManhwa = await this.userManhwaRepository.removeManhwa(
      user_id,
      manhwasID,
    )

    if (!userManhwa) {
      throw new ResourceNotFoundError()
    }

    return {
      userManhwa,
    }
  }
}
