import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { Users } from '@prisma/client'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error'
import { UsernameAlreadyExistsError } from './errors/username-already-exists-error'

interface RegisterUserUseCaseRequest {
  name: string
  password: string
  email: string
  username: string
}

interface RegisterUserUseCaseReponse {
  user: Users
}

export class RegisterUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
    username,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseReponse> {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new EmailAlreadyExistsError()
    }

    const userWithSameUsername = await this.usersRepository.findByUsername(
      username,
    )

    if (userWithSameUsername) {
      throw new UsernameAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      username,
      password_hash,
      email,
    })

    return {
      user,
    }
  }
}
