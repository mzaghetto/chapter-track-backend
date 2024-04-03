import { expect, describe, it, beforeEach } from 'vitest'
import {
  Pageable,
  Page,
  Pagination,
  DEFAULT_LIMIT_PAGINATION,
  DEFAULT_PAGE_PAGINATION,
} from './pageable'

describe('Pageable', () => {
  let pageable: Pageable<any>

  beforeEach(() => {
    pageable = new Pageable<any>()
  })

  describe('buildPage', () => {
    it('should use default values if page or limit are not provided', () => {
      const params = pageable.buildPage({})
      expect(params.page).toBe(DEFAULT_PAGE_PAGINATION)
      expect(params.limit).toBe(DEFAULT_LIMIT_PAGINATION)
    })

    it('should accept custom page and limit values', () => {
      const customPage = 2
      const customLimit = 5
      const customNameFilter = 'custom'
      const params = pageable.buildPage({
        page: customPage,
        limit: customLimit,
        filterName: customNameFilter,
      })
      expect(params.page).toBe(customPage)
      expect(params.limit).toBe(customLimit)
      expect(params.filterName).toBe(customNameFilter)
    })
  })

  describe('buildPagination', () => {
    let items: any[]
    let params: any

    beforeEach(() => {
      items = [{ name: 'Item1' }, { name: 'Item2' }]
      params = { page: 1, limit: 1 }
    })

    it('should correctly calculate totalPages', () => {
      const pagination: Pagination<any> = pageable.buildPagination(
        items,
        params,
      )
      expect(pagination.totalPages).toBe(2)
    })

    it('should correctly slice items per page', () => {
      const pagination: Pagination<any> = pageable.buildPagination(
        items,
        params,
      )
      expect(pagination.items.length).toBe(1)
      expect(pagination.items[0]).toEqual(items[0])
    })

    it('should correctly filter by name', () => {
      params.filterName = 'Item1'
      const pagination: Pagination<any> = pageable.buildPagination(
        items,
        params,
      )
      expect(pagination.items.length).toBe(1)
      expect.objectContaining('Item1')
    })

    it('should sort items by asc', () => {
      params.sort = 'asc'
      const pagination: Pagination<any> = pageable.buildPagination(
        items,
        params,
      )
      expect(pagination.items.length).toBe(1)
      expect.objectContaining('Item1')
    })

    it('should sort items by desc', () => {
      params.sort = 'desc'
      const pagination: Pagination<any> = pageable.buildPagination(
        items,
        params,
      )
      expect(pagination.items.length).toBe(1)
      expect.objectContaining('Item1')
    })

    it('should handle an empty array of items', () => {
      const pagination: Pagination<any> = pageable.buildPagination([], params)
      expect(pagination.totalItems).toBe(0)
      expect(pagination.totalPages).toBe(0)
      expect(pagination.items.length).toBe(0)
    })
  })

  describe('getFilteredNameItems', () => {
    let items: any[]

    beforeEach(() => {
      items = [
        { name: 'Item1' },
        { name: 'Item2' },
        { name: 'Item3' },
        { name: 'Item4' },
      ]
    })

    it('should return all items if no filter is provided', () => {
      const filteredItems = pageable.getFilteredNameItems(items)
      expect(filteredItems).toEqual(items)
    })

    it('should return items that match the filter', () => {
      const filteredItems = pageable.getFilteredNameItems(items, 'Item1')
      expect(filteredItems).toEqual([{ name: 'Item1' }])
    })

    it('should return an empty array if no items match the filter', () => {
      const filteredItems = pageable.getFilteredNameItems(
        items,
        'NonExistentItem',
      )
      expect(filteredItems).toEqual([])
    })

    it('should be case-insensitive', () => {
      const filteredItems = pageable.getFilteredNameItems(items, 'item1')
      expect(filteredItems).toEqual([{ name: 'Item1' }])
    })
  })

  describe('Page', () => {
    it('should use default values if page or limit are not provided', () => {
      const page = new Page()
      expect(page.page).toBeUndefined()
      expect(page.limit).toBeUndefined()
      expect(page.sort).toBeUndefined()
      expect(page.filterName).toBeUndefined()
    })
  })

  describe('Pagination', () => {
    it('should have default values for properties', () => {
      const pagination = new Pagination<any>()
      expect(pagination.previousPage).toBeUndefined()
      expect(pagination.currentPage).toBeUndefined()
      expect(pagination.nextPage).toBeUndefined()
      expect(pagination.lastPage).toBeUndefined()
      expect(pagination.totalPages).toBeUndefined()
      expect(pagination.totalItems).toBeUndefined()
      expect(pagination.maxItemsPerPage).toBeUndefined()
      expect(pagination.totalItemsPage).toBeUndefined()
      expect(pagination.items).toBeUndefined()
    })
  })
})
