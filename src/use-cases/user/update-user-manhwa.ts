import { UserManhwaRepository } from '@/repositories/user-manhwa-repository'
import { UserManhwa, Prisma } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found'

interface UpdateUserManhwaUseCaseRequest {
  userManhwaId: bigint
  userId: bigint
  data: Prisma.UserManhwaUncheckedUpdateInput
}

interface UpdateUserManhwaUseCaseResponse {
  userManhwa: UserManhwa
}

export class UpdateUserManhwaUseCase {
  constructor(private userManhwaRepository: UserManhwaRepository) {}

  async execute({
    userManhwaId,
    userId,
    data,
  }: UpdateUserManhwaUseCaseRequest): Promise<UpdateUserManhwaUseCaseResponse> {
    const userManhwa = await this.userManhwaRepository.update(
      userManhwaId,
      data,
    )

    if (!userManhwa || userManhwa.userId !== userId) {
      throw new ResourceNotFoundError()
    }

    return {
      userManhwa,
    }
  }
}
