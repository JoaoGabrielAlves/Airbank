import { gql } from 'graphql-tag'

export const paginatedAccounts = gql`
  query paginatedAccounts(
    $take: Int!
    $page: Int!
    $sortField: String
    $sortDirection: String
  ) {
    paginatedAccounts(
      take: $take
      page: $page
      sortField: $sortField
      sortDirection: $sortDirection
    ) {
      pageInfo {
        hasNextPage
      }
      edges {
        node {
          id
          name
          bank
        }
      }
    }
  }
`
