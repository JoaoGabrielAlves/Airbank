import { gql } from 'apollo-server-express'

const typeDefs = gql`
  type Query {
    paginatedAccounts(first: Int, after: String): AccountResponse
    paginatedCategories(first: Int, after: String): CategoryResponse
    paginatedTransactions(first: Int, after: String): TransactionResponse
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
    amount: String!
    currency: String!
    Category: Category
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
`

export default typeDefs
