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

type OffsetPaginationPageInfo = {
  hasNextPage: boolean
}

type CursorPaginationPageInfo = {
  endCursor: string
  hasNextPage: boolean
}

export type CategoryPaginatedResponse = {
  paginatedCategories: {
    pageInfo: OffsetPaginationPageInfo
    edges: Array<{
      node: Account
    }>
  }
}

export type AccountPaginatedResponse = {
  paginatedAccounts: {
    pageInfo: OffsetPaginationPageInfo
    edges: Array<{
      node: Account
    }>
  }
}

export type TransactionPaginatedReponse = {
  paginatedTransactions: {
    pageInfo: CursorPaginationPageInfo
    edges: Array<{
      cursor: string
      node: Transaction
    }>
  }
}
