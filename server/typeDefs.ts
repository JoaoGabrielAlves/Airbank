import { gql } from 'apollo-server-express'

const typeDefs = gql`
  type Query {
    allAccounts: [Account!]!
  }

  type Account {
    id: String!
    name: String!
    bank: String!
  }
`

export default typeDefs
