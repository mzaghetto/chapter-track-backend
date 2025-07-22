import { ManhwasRepository } from '@/repositories/manhwas-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'

interface DeleteManhwaUseCaseRequest {
  manhwaId: bigint
}

export class DeleteManhwaUseCase {
  constructor(private manhwasRepository: ManhwasRepository) {}

  async execute({ manhwaId }: DeleteManhwaUseCaseRequest): Promise<void> {
    const manhwa = await this.manhwasRepository.findByID(manhwaId)

    if (!manhwa) {
      throw new ResourceNotFoundError()
    }

    await this.manhwasRepository.delete(manhwaId)
  }
}
