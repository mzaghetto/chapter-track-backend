import { UserManhwaRepository } from '@/repositories/user-manhwa-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface RemoveManhwaFromUserUseCaseRequest {
  userId: bigint
  manhwaId: bigint
}

export class RemoveManhwaFromUserUseCase {
  constructor(private userManhwaRepository: UserManhwaRepository) {}

  async execute({
    userId,
    manhwaId,
  }: RemoveManhwaFromUserUseCaseRequest): Promise<void> {
    const userManhwa = await this.userManhwaRepository.findByUserIdAndManhwaId(
      userId,
      manhwaId,
    )

    if (!userManhwa) {
      throw new ResourceNotFoundError()
    }

    await this.userManhwaRepository.delete(userManhwa.id)
  }
}
