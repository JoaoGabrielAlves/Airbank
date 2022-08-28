import { gql } from 'graphql-tag'

export const transactionById = gql`
  query transactionById($transactionId: String!) {
    transactionById(id: $transactionId) {
      reference
      date
      amount
      currency
      Category {
        name
        color
      }
      Account {
        name
        bank
      }
    }
  }
`
