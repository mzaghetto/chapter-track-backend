import { UsersRepository } from '@/repositories/users-repository'
import { Prisma, Users } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { RoleUpdateError } from './errors/role-update-error'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error'
import { UsernameAlreadyExistsError } from './errors/username-already-exists-error'

interface UpdateUserProfileCaseRequest {
  userID: bigint
  data: Prisma.UsersUpdateInput
}

interface UpdateUserProfileCaseResponse {
  user: Users
}

export class UpdateUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userID,
    data,
  }: UpdateUserProfileCaseRequest): Promise<UpdateUserProfileCaseResponse> {
    if (data.role) {
      throw new RoleUpdateError()
    }

    if (data.email) {
      const verifyEmailAlreadyExists = await this.usersRepository.findByEmail(
        data.email,
      )

      if (verifyEmailAlreadyExists) {
        throw new EmailAlreadyExistsError()
      }
    }

    if (data.username) {
      const verifyEmailAlreadyExists =
        await this.usersRepository.findByUsername(data.username)

      if (verifyEmailAlreadyExists) {
        throw new UsernameAlreadyExistsError()
      }
    }

    const user = await this.usersRepository.findByIDAndUpdate(userID, data)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}
