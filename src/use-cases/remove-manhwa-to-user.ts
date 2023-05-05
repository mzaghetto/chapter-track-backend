import { UserManhwaRepository } from '@/repositories/user-manhwa-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { UserManhwa } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { ManhwasRepository } from '@/repositories/manhwas-repository'

interface RemoveManhwaToUserManhwaUseCaseRequest {
  user_id: string
  manhwaID: string
}

interface RemoveManhwaToUserManhwaUseCaseReponse {
  userManhwa: UserManhwa
}

export class RemoveManhwaToUserManhwaUseCase {
  constructor(
    private userManhwaRepository: UserManhwaRepository,
    private usersRepository: UsersRepository,
    private manhwaRepository: ManhwasRepository,
  ) {}

  async execute({
    user_id,
    manhwaID,
  }: RemoveManhwaToUserManhwaUseCaseRequest): Promise<RemoveManhwaToUserManhwaUseCaseReponse> {
    const userExists = await this.usersRepository.findByID(user_id)

    if (!userExists) {
      throw new ResourceNotFoundError()
    }

    const manhwaExists = await this.manhwaRepository.findByID(manhwaID)

    if (!manhwaExists) {
      throw new ResourceNotFoundError()
    }

    const userManhwa = await this.userManhwaRepository.removeManhwa(
      user_id,
      manhwaID,
    )

    if (!userManhwa) {
      throw new ResourceNotFoundError()
    }

    return {
      userManhwa,
    }
  }
}
