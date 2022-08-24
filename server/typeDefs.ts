import { typeDef as Account } from './schemas/accounts'
import { typeDef as Category } from './schemas/categories'
import { typeDef as Transaction } from './schemas/transactions'
import { gql } from 'apollo-server-express'

const typeDefs = gql`
  type Query

  type Mutation

  type OffsetPaginationInfo {
    hasNextPage: Boolean
  }

  type CursorPaginationPageInfo {
    endCursor: String
    hasNextPage: Boolean
  }

  type Count {
    _all: Int!
  }
`

export default [typeDefs, Account, Category, Transaction]
