import { gql } from 'graphql-tag'

export const updateTransactionCategory = gql`
  mutation updateTransactionCategory(
    $transactionId: String!
    $categoryName: String!
  ) {
    updateTransactionCategory(
      transactionId: $transactionId
      categoryName: $categoryName
    ) {
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
