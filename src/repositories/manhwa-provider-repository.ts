import { ManhwaProvider, Prisma } from '@prisma/client'
import { DetailedManhwaProvider } from './dtos/detailed-manhwa-provider'

export interface FindAllFilters {
  manhwaId?: bigint
  providerId?: bigint
  manhwaName?: string
  providerName?: string
}

export interface ManhwaProviderRepository {
  create(
    data: Prisma.ManhwaProviderUncheckedCreateInput,
  ): Promise<ManhwaProvider>
  findByManhwaIdAndProviderId(
    manhwaId: bigint,
    providerId: bigint,
  ): Promise<ManhwaProvider | null>
  findById(id: bigint): Promise<ManhwaProvider | null>
  findAll(filters: FindAllFilters): Promise<DetailedManhwaProvider[]>
  update(
    id: bigint,
    data: Prisma.ManhwaProviderUpdateInput,
  ): Promise<ManhwaProvider | null>
  delete(id: bigint): Promise<void>
}
