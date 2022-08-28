import { gql } from 'graphql-tag'

export const paginatedCategories = gql`
  query paginatedCategories(
    $take: Int!
    $page: Int!
    $sortField: String
    $sortDirection: String
  ) {
    paginatedCategories(
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
          color
        }
      }
    }
  }
`
