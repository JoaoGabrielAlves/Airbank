import { gql } from 'apollo-server-express'

const typeDefs = gql`
  type Query {
    paginatedAccounts(first: Int, after: String): Response
    allCategories: [Category!]!
    allTransactions: [Transaction!]!
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

  type Edge {
    cursor: String
    node: Account
  }

  type PageInfo {
    endCursor: String
    hasNextPage: Boolean
  }

  type Response {
    pageInfo: PageInfo
    edges: [Edge]
  }
`

export default typeDefs
