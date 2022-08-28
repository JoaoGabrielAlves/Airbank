import { gql } from 'graphql-tag'

export const autocompleteCategory = gql`
  query autocompleteCategory($search: String!) {
    autocompleteCategory(search: $search) {
      id
      name
    }
  }
`
