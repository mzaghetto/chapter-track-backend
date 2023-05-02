import { UserManhwaRepository } from '@/repositories/user-manhwa-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { UserManhwa } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface RegisterUserManhwaUseCaseRequest {
  user_id: string
  manhwas: null
  telegram_id: string | null
}

interface RegisterUserManhwaUseCaseReponse {
  userManhwa: UserManhwa
}

export class RegisterUserManhwaUseCase {
  constructor(
    private userManhwaRepository: UserManhwaRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    user_id,
    manhwas,
    telegram_id,
  }: RegisterUserManhwaUseCaseRequest): Promise<RegisterUserManhwaUseCaseReponse> {
    const userExists = await this.usersRepository.findByID(user_id)

    if (!userExists) {
      throw new ResourceNotFoundError()
    }

    const userManhwa = await this.userManhwaRepository.create({
      user_id,
      manhwas,
      telegram_id,
    })

    return {
      userManhwa,
    }
  }
}
