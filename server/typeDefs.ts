import { gql } from 'apollo-server-express'

const typeDefs = gql`
  type Query {
    paginatedAccounts(
      take: Int
      page: Int!
      sortField: String
      sortDirection: String
    ): AccountResponse
    paginatedCategories(
      take: Int
      page: Int!
      sortField: String
      sortDirection: String
    ): CategoryResponse
    paginatedTransactions(
      take: Int
      after: String
      search: String
      bank: String
      categoryId: String
      startingMonth: String
      endingMonth: String
      sortField: String
      sortDirection: String
    ): TransactionResponse
    autocompleteAccountBanks(search: String): [Account]
    autocompleteCategory(search: String): [Category]
    accountsCount: Count
    categoriesCount: Count
    transactionsCount: Count
    accountById(id: String!): Account
    categoryById(id: String!): Category
    transactionById(id: String!): Transaction
  }

  type Account {
    id: String!
    name: String!
    bank: String!
  }

  type Category {
    id: String!
    name: String!
    color: String
  }

  type Transaction {
    id: String!
    reference: String
    date: String!
    amount: Float!
    currency: String!
    Category: Category
    Account: Account
  }

  type OffsetPaginationInfo {
    hasNextPage: Boolean
  }

  type CursorPaginationPageInfo {
    endCursor: String
    hasNextPage: Boolean
  }

  type AccountEdge {
    node: Account
  }

  type AccountResponse {
    pageInfo: OffsetPaginationInfo
    edges: [AccountEdge]
  }

  type CategoryEdge {
    node: Category
  }

  type CategoryResponse {
    pageInfo: OffsetPaginationInfo
    edges: [CategoryEdge]
  }

  type TransactionEdge {
    cursor: String
    node: Transaction
  }

  type TransactionResponse {
    pageInfo: CursorPaginationPageInfo
    edges: [TransactionEdge]
  }

  type Count {
    _all: Int!
  }

  type Mutation {
    updateTransactionCategory(
      transactionId: String!
      categoryName: String!
    ): Transaction
  }
`

export default typeDefs
