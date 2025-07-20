import { ManhwaProvider, Prisma } from '@prisma/client'

export interface ManhwaProviderRepository {
  create(data: Prisma.ManhwaProviderUncheckedCreateInput): Promise<ManhwaProvider>
  findByManhwaIdAndProviderId(
    manhwaId: bigint,
    providerId: bigint,
  ): Promise<ManhwaProvider | null>
  findById(id: bigint): Promise<ManhwaProvider | null>
  update(
    id: bigint,
    data: Prisma.ManhwaProviderUpdateInput,
  ): Promise<ManhwaProvider | null>
  delete(id: bigint): Promise<void>
}