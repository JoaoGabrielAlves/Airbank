import { gql } from 'graphql-tag'

export const categoriesCount = gql`
  query categoriesCount {
    categoriesCount {
      _all
    }
  }
`
