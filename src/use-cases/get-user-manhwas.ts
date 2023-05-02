import { UserManhwa } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { UserManhwaRepository } from '@/repositories/user-manhwa-repository'

interface GetUserManhwasCaseRequest {
  userID: string
}

interface GetUserManhwasCaseResponse {
  userManhwa: UserManhwa
}

export class GetUserManhwasUseCase {
  constructor(private userManhwaRepository: UserManhwaRepository) {}

  async execute({
    userID,
  }: GetUserManhwasCaseRequest): Promise<GetUserManhwasCaseResponse> {
    const userManhwa = await this.userManhwaRepository.getManhwasByProfile(
      userID,
    )

    if (!userManhwa) {
      throw new ResourceNotFoundError()
    }

    return {
      userManhwa,
    }
  }
}
