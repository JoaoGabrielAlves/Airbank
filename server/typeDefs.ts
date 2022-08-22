import { gql } from 'apollo-server-express'

const typeDefs = gql`
  type Query {
    paginatedAccounts(first: Int, after: String): AccountResponse
    paginatedCategories(first: Int, after: String): CategoryResponse
    paginatedTransactions(
      first: Int
      after: String
      search: String
      bank: String
      categoryId: String
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

  type PageInfo {
    endCursor: String
    hasNextPage: Boolean
  }

  type AccountEdge {
    cursor: String
    node: Account
  }

  type AccountResponse {
    pageInfo: PageInfo
    edges: [AccountEdge]
  }

  type CategoryEdge {
    cursor: String
    node: Category
  }

  type CategoryResponse {
    pageInfo: PageInfo
    edges: [CategoryEdge]
  }

  type TransactionEdge {
    cursor: String
    node: Transaction
  }

  type TransactionResponse {
    pageInfo: PageInfo
    edges: [TransactionEdge]
  }

  type Count {
    _all: Int!
  }
`

export default typeDefs
