import { gql } from 'graphql-tag'

export const autocompleteAccountBanks = gql`
  query autocompleteAccountBanks($search: String!) {
    autocompleteAccountBanks(search: $search) {
      bank
    }
  }
`
