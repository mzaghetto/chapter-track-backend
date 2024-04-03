export const DEFAULT_LIMIT_PAGINATION = 10
export const DEFAULT_PAGE_PAGINATION = 1

export class Page {
  page?: number
  limit?: number
  sort?: 'asc' | 'desc'
  filterName?: string
}

export class Pagination<T> {
  previousPage!: number | null
  currentPage!: number
  nextPage!: number | null
  lastPage!: boolean
  totalPages!: number
  totalItems!: number
  maxItemsPerPage!: number
  totalItemsPage!: number
  items!: T[]
}

interface PageParams {
  page: number
  limit: number
  sort?: 'asc' | 'desc'
  filterName?: string
}

export abstract class Pageable<T> {
  buildPage(page: Page): PageParams {
    return {
      page: page.page ? Number(page.page) : DEFAULT_PAGE_PAGINATION,
      limit: page.limit ? Number(page.limit) : DEFAULT_LIMIT_PAGINATION,
      sort: page.sort,
      filterName: page.filterName,
    }
  }

  buildPagination(items: T[], params: PageParams): Pagination<T> {
    const { sort, filterName, page, limit } = params

    let filteredItems = items
    if (filterName) {
      filteredItems = this.getFilteredNameItems(items, filterName)
    }

    if (sort) {
      filteredItems = this.getSortedItems(
        filteredItems,
        sort,
        'name' as keyof T,
      )
    }

    const totalItems = filteredItems.length

    const totalPages = this.getTotalPages(filteredItems, limit)

    const currentPage = this.getCurrentPage(page, totalPages)

    const maxItemsPerPage = this.getLimit(page, limit, totalPages)

    const itemsPerPage = this.getItemsPerPage(
      filteredItems,
      currentPage,
      maxItemsPerPage,
    )

    const previousPage = currentPage > 1 ? currentPage - 1 : null
    const nextPage = currentPage < totalPages ? currentPage + 1 : null

    return {
      previousPage,
      currentPage,
      nextPage,
      lastPage: currentPage === totalPages,
      totalPages,
      totalItems,
      maxItemsPerPage,
      totalItemsPage: itemsPerPage.length,
      items: itemsPerPage,
    }
  }

  private getTotalPages(items: T[], limit: number): number {
    return Math.ceil(items.length / limit)
  }

  private getItemsPerPage(items: T[], page: number, limit: number): T[] {
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    return items.slice(startIndex, endIndex)
  }

  private getSortedItems(
    items: T[],
    sort: 'asc' | 'desc',
    property: keyof T,
  ): T[] {
    return items.slice().sort((a: T, b: T) => {
      if (sort === 'asc') {
        return String(a[property]).localeCompare(String(b[property]))
      } else {
        return String(b[property]).localeCompare(String(a[property]))
      }
    })
  }

  getFilteredNameItems(items: T[], filterName?: string): T[] {
    return items.filter((item: any) => {
      const itemName = String(item.name).toLowerCase()
      return itemName.includes(filterName?.toLowerCase() ?? '')
    })
  }

  private getCurrentPage(page: number, totalPages: number): number {
    return page > totalPages ? 1 : page
  }

  private getLimit(page: number, limit: number, totalPages: number): number {
    return page > totalPages ? 0 : limit
  }
}
