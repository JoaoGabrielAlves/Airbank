import { gql } from 'graphql-tag'

export const transactionsCount = gql`
  query transactionsCount {
    transactionsCount {
      _all
    }
  }
`
