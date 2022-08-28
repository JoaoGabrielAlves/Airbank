import { gql } from 'graphql-tag'

export const accountById = gql`
  query accountById($accountId: String!) {
    accountById(id: $accountId) {
      name
      bank
    }
  }
`
