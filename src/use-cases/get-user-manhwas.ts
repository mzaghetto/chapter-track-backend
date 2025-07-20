import { UserManhwaRepository } from '@/repositories/user-manhwa-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { DetailedUserManhwa } from '@/repositories/dtos/detailed-user-manhwa'

interface GetUserManhwasUseCaseRequest {
  userId: bigint
  page: number
  pageSize: number
}

interface GetUserManhwasUseCaseResponse {
  userManhwas: DetailedUserManhwa[]
  total: number
}

export class GetUserManhwasUseCase {
  constructor(
    private userManhwaRepository: UserManhwaRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    page,
    pageSize,
  }: GetUserManhwasUseCaseRequest): Promise<GetUserManhwasUseCaseResponse> {
    const user = await this.usersRepository.findByID(userId)
    if (!user) {
      throw new ResourceNotFoundError()
    }

    const userManhwas = await this.userManhwaRepository.findByUserId(
      userId,
      page,
      pageSize,
    )
    const total = await this.userManhwaRepository.countByUserId(userId)

    return {
      userManhwas,
      total,
    }
  }
}
