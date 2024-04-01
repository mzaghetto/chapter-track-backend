import { Manhwas, Prisma } from '@prisma/client'

export interface ManhwasRepository {
  create(data: Prisma.ManhwasCreateInput): Promise<Manhwas>
  findByName(
    name: string | Prisma.StringFieldUpdateOperationsInput,
  ): Promise<Prisma.ManhwasCreateInput | null>
  findByIDAndUpdate(
    manhwaID: string,
    data: string | Prisma.ManhwasUpdateInput,
  ): Promise<Manhwas | null>
  findByID(manhwaID: string): Promise<Manhwas | null>
  findByIDs(manhwasID: string[]): Promise<Manhwas[] | null>
}
