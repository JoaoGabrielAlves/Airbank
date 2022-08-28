import { gql } from 'graphql-tag'

export const accountsCount = gql`
  query accountsCount {
    accountsCount {
      _all
    }
  }
`
