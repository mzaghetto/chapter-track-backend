import { UsersRepository } from '@/repositories/users-repository'
import { Users } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface GetUserProfileCaseRequest {
  userID: string
}

interface GetUserProfileCaseResponse {
  user: Users
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userID,
  }: GetUserProfileCaseRequest): Promise<GetUserProfileCaseResponse> {
    const user = await this.usersRepository.findByID(userID)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}
