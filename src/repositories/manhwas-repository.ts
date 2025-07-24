import { Manhwas, Prisma } from '@prisma/client'

export interface ManhwasRepository {
  create(data: Prisma.ManhwasCreateInput): Promise<Manhwas>
  findByName(name: string): Promise<Manhwas | null>
  filterByName(
    name: string,
    genre?: string,
    status?: 'ONGOING' | 'COMPLETED' | 'HIATUS',
  ): Promise<{
    items: (Manhwas & {
      manhwaProviders: {
        lastEpisodeReleased: number | null
      }[]
    })[]
    totalItems: number
  } | null>
  findByIDAndUpdate(
    manhwaID: bigint,
    data: string | Prisma.ManhwasUpdateInput,
  ): Promise<Manhwas | null>
  findByID(manhwaID: bigint): Promise<
    | (Manhwas & {
        manhwaProviders: {
          lastEpisodeReleased: number | null
        }[]
      })
    | null
  >
  findByIDs(manhwasID: bigint[]): Promise<Manhwas[] | null>
  delete(id: bigint): Promise<void>
  findRandom(count: number): Promise<Manhwas[]>
}
