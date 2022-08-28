import { gql } from 'graphql-tag'

export const paginatedTransactions = gql`
  query paginatedTransactions(
    $take: Int!
    $page: Int
    $skip: String
    $search: String
    $bank: String
    $categoryId: String
    $startingMonth: String
    $endingMonth: String
    $sortField: String
    $sortDirection: String
  ) {
    paginatedTransactions(
      take: $take
      page: $page
      skip: $skip
      search: $search
      bank: $bank
      categoryId: $categoryId
      startingMonth: $startingMonth
      endingMonth: $endingMonth
      sortField: $sortField
      sortDirection: $sortDirection
    ) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          reference
          date
          amount
          currency
          Category {
            name
            color
          }
        }
      }
    }
  }
`
