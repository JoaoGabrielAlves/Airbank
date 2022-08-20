import { gql } from 'apollo-server-express'

const typeDefs = gql`
  type Query {
    allAccounts: [Account!]!
    allCategories: [Category!]!
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
`

export default typeDefs
