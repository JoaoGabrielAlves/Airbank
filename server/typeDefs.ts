import { gql } from 'apollo-server-express'

const typeDefs = gql`
  type Query {
    allAccounts: [Account!]!
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
`

export default typeDefs
