import { ManhwasRepository } from '@/repositories/manhwas-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { Page, Pageable } from '@/lib/pageable'
import { prisma } from '@/lib/prisma'

interface FilterManhwasUseCaseRequest {
  nameToFilter?: string
  genre?: string
  status?: 'ONGOING' | 'COMPLETED' | 'HIATUS'
  params: Page
}

interface manhwaListResponse {
  manhwaId: bigint
  manhwaName: string
  author: string | null
  genre: string | null
  description: string | null
  status: 'ONGOING' | 'COMPLETED' | 'HIATUS' | null
  coverImage: string | null | undefined
  alternativeNames: string[] | null
  lastEpisodeReleased?: number
}

interface FilterManhwaByNameUseCaseReponse {
  previousPage: number | null
  currentPage: number
  nextPage: number | null
  lastPage: boolean
  totalPages: number
  totalItems: number
  maxItemsPerPage: number
  totalItemsPage: number
  items: manhwaListResponse[]
}

export class FilterManhwaByNameUseCase extends Pageable<manhwaListResponse> {
  constructor(private manhwasRepository: ManhwasRepository) {
    super()
  }

  async execute({
    nameToFilter,
    genre,
    status,
    params,
  }: FilterManhwasUseCaseRequest): Promise<FilterManhwaByNameUseCaseReponse> {
    const manhwaFilteredByName = await this.manhwasRepository.filterByName(
      nameToFilter ?? '',
      genre,
      status,
    )

    if (!manhwaFilteredByName || manhwaFilteredByName.items.length === 0) {
      throw new ResourceNotFoundError()
    }

    const manhwaIds = manhwaFilteredByName.items.map((manhwa) => manhwa.id)

    const manhwaProviders = await prisma.manhwaProvider.findMany({
      where: {
        manhwaId: {
          in: manhwaIds,
        },
      },
    })

    const items = manhwaFilteredByName.items.map((manhwa) => {
      const providersForManhwa = manhwaProviders.filter(
        (provider) => provider.manhwaId === manhwa.id,
      )

      const lastEpisodeReleased =
        providersForManhwa.length > 0
          ? Math.max(
              ...providersForManhwa.map(
                (provider) => provider.lastEpisodeReleased ?? 0,
              ),
            )
          : undefined

      return {
        manhwaId: manhwa.id,
        manhwaName: manhwa.name,
        author: manhwa.author,
        genre: manhwa.genre ? JSON.stringify(manhwa.genre) : null,
        description: manhwa.description,
        status: manhwa.status,
        coverImage: manhwa.coverImage,
        alternativeNames: manhwa.alternativeNames
          ? JSON.parse(JSON.stringify(manhwa.alternativeNames))
          : null,
        lastEpisodeReleased,
      }
    })

    const manhwa = this.buildPagination(items, this.buildPage(params))

    return {
      previousPage: manhwa.previousPage,
      currentPage: manhwa.currentPage,
      nextPage: manhwa.nextPage,
      lastPage: manhwa.lastPage,
      totalPages: manhwa.totalPages,
      totalItems: manhwaFilteredByName.totalItems,
      maxItemsPerPage: manhwa.maxItemsPerPage,
      totalItemsPage: manhwa.totalItemsPage,
      items: manhwa.items,
    }
  }
}
