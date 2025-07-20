import { Prisma, Providers } from '@prisma/client'

export interface ProvidersRepository {
  create(data: Prisma.ProvidersCreateInput): Promise<Providers>
  findByName(name: string): Promise<Providers | null>
  findById(id: bigint): Promise<Providers | null>
  findAll(): Promise<Providers[]>
  update(id: bigint, data: Prisma.ProvidersUpdateInput): Promise<Providers | null>
  delete(id: bigint): Promise<void>
}