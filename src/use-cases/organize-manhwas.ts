import { InvalidManhwaIdError } from './errors/invalid-manhwa-id-error'
import { UserManhwaRepository } from '@/repositories/user-manhwa-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { ManhwaPositionNegativeError } from './errors/manhwa-position-negative-error'
import { ManhwaPositionBreakOrderError } from './errors/manhwa-position-break-order-error'
import { ManhwaPositionAlreadyTakenError } from './errors/manhwa-position-already-taken-error'

interface OrganizeManhwasUseCaseRequest {
  userId: bigint
  manhwaOrders: { manhwaId: bigint; order: number }[]
}

export class OrganizeManhwasUseCase {
  constructor(private userManhwaRepository: UserManhwaRepository) {}

  async execute({
    userId,
    manhwaOrders,
  }: OrganizeManhwasUseCaseRequest): Promise<void> {
    const userManhwas = await this.userManhwaRepository.findManyByUserId(userId)

    if (!userManhwas || userManhwas.length === 0) {
      throw new ResourceNotFoundError()
    }

    const orders = new Set<number>()
    for (const orderInfo of manhwaOrders) {
      if (orderInfo.order < 0) {
        throw new ManhwaPositionNegativeError()
      }

      if (orders.has(orderInfo.order)) {
        throw new ManhwaPositionAlreadyTakenError(orderInfo.order)
      }
      orders.add(orderInfo.order)

      const userManhwa = userManhwas.find(
        (um) => um.manhwaId === orderInfo.manhwaId,
      )

      if (!userManhwa) {
        throw new InvalidManhwaIdError(orderInfo.manhwaId)
      }

      await this.userManhwaRepository.update(userManhwa.id, {
        order: orderInfo.order,
      })
    }

    const sortedOrders: number[] = [...orders].sort((a, b) => a - b)
    for (let i = 0; i < sortedOrders.length; i++) {
      if (sortedOrders[i] !== i) {
        throw new ManhwaPositionBreakOrderError()
      }
    }
  }
}
