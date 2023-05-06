import { InvalidManhwaIdError } from './errors/invalid-manhwa-id-error'
import { ManhwaPositionAlreadyTakenError } from './errors/manhwa-position-already-taken-error'
import { ManhwaPositionBreakOrderError } from './errors/manhwa-position-break-order-error'
import { ManhwaPositionNegativeError } from './errors/manhwa-position-negative-error'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { UserManhwaRepository } from '@/repositories/user-manhwa-repository'

interface OrganizeManhwasCaseRequest {
  userID: string
  order: Array<{ manhwa_id: string; manhwa_position: number }>
}

interface OrganizeManhwasCaseResponse {
  userManhwa: string
}

export class OrganizeManhwasUseCase {
  constructor(private userManhwaRepository: UserManhwaRepository) {}

  async execute({
    userID,
    order,
  }: OrganizeManhwasCaseRequest): Promise<OrganizeManhwasCaseResponse> {
    const getAllManhwas = await this.userManhwaRepository.getAllManhwas(userID)

    if (getAllManhwas === null) {
      throw new ResourceNotFoundError()
    }

    for (const manhwa of order) {
      const manhwaExists = getAllManhwas.some(
        (m) => m.manhwa_id === manhwa.manhwa_id,
      )
      if (!manhwaExists) {
        throw new InvalidManhwaIdError(manhwa.manhwa_id)
      }
    }

    const updatedManhwas = getAllManhwas.map((manhwa) => {
      const orderObj = order.find((o) => o.manhwa_id === manhwa.manhwa_id)
      if (orderObj) {
        manhwa.manhwa_position = orderObj.manhwa_position
      }
      return manhwa
    })

    const sortedManhwas = updatedManhwas.sort(
      (a, b) => a.manhwa_position - b.manhwa_position,
    )

    for (let i = 0; i < sortedManhwas.length; i++) {
      const manhwa = sortedManhwas[i]
      if (manhwa.manhwa_position !== i) {
        if (manhwa.manhwa_position < 0) {
          throw new ManhwaPositionNegativeError()
        } else if (sortedManhwas.some((m) => m.manhwa_position === i)) {
          throw new ManhwaPositionAlreadyTakenError(manhwa.manhwa_id)
        } else {
          throw new ManhwaPositionBreakOrderError(
            manhwa.manhwa_id,
            i,
            manhwa.manhwa_position,
          )
        }
      }
    }

    const userManhwa = await this.userManhwaRepository.updateManhwaOrder(
      userID,
      order,
    )

    return {
      userManhwa,
    }
  }
}
