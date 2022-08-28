import { gql } from 'graphql-tag'

export const categoryById = gql`
  query categoryById($categoryId: String!) {
    categoryById(id: $categoryId) {
      name
      color
    }
  }
`
