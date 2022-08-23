export type Category = {
  id: string
  name: string
  color: string
}

export type Account = {
  id: string
  name: string
  bank: string
}

export type Transaction = {
  id: string
  reference: string
  date: string
  amount: number
  currency: string
  Category: Category
}

export type Count = {
  _all: number
}

type PageInfo = {
  endCursor: string
  hasNextPage: boolean
}

type PaginatedResponseKey =
  | 'paginatedCategories'
  | 'paginatedAccounts'
  | 'paginatedTransactions'

export type PaginatedResponse = {
  [key in PaginatedResponseKey]: {
    pageInfo: PageInfo
    edges: Array<{
      cursor: string
      node: Category | Account | Transaction
    }>
  }
}
