import { gql } from 'apollo-server-express'
import { Context } from '../context'
import {
  QueryAutocompleteAccountBanksArgs,
  QueryPaginatedAccountsArgs,
  QueryAccountByIdArgs,
} from '../../static/types/generated'

export const typeDef = gql`
  extend type Query {
    paginatedAccounts(
      take: Int!
      page: Int!
      sortField: String
      sortDirection: String
    ): AccountResponse

    autocompleteAccountBanks(search: String!): [Account]

    accountsCount: Count

    accountById(id: String!): Account
  }

  type Account {
    id: String!
    name: String!
    bank: String!
  }

  type AccountEdge {
    node: Account
  }

  type AccountResponse {
    pageInfo: OffsetPaginationInfo
    edges: [AccountEdge]
  }
`

export const resolvers = {
  Query: {
    paginatedAccounts: async (
      _parent: Object,
      args: QueryPaginatedAccountsArgs,
      context: Context
    ) => {
      let queryResults = null

      const orderBy = args.sortField
        ? {
            [args.sortField]: args.sortDirection,
          }
        : undefined

      const skip = args.take * (args.page - 1)

      queryResults = await context.prisma.account.findMany({
        take: args.take,
        skip: skip,
        orderBy: orderBy,
      })

      if (queryResults.length > 0) {
        const accountsCount = await context.prisma.account.count()

        const result = {
          pageInfo: {
            hasNextPage: accountsCount > skip + args.take,
          },

          edges: queryResults.map((account) => ({
            cursor: account.id,
            node: account,
          })),
        }

        return result
      } else {
        return {
          pageInfo: {
            endCursor: null,
            hasNextPage: false,
          },
          edges: [],
        }
      }
    },
    accountsCount: async (_parent: Object, _args: {}, context: Context) => {
      return await context.prisma.account.count({
        select: {
          _all: true,
        },
      })
    },
    autocompleteAccountBanks: async (
      _parent: Object,
      args: QueryAutocompleteAccountBanksArgs,
      context: Context
    ) => {
      if (!args.search) {
        return []
      }

      return context.prisma.account.findMany({
        where: {
          bank: {
            startsWith: args.search,
            mode: 'insensitive',
          },
        },
        distinct: ['bank'],
      })
    },
    accountById: async (
      _parent: Object,
      args: QueryAccountByIdArgs,
      context: Context
    ) => {
      return await context.prisma.account.findUnique({
        where: {
          id: args.id,
        },
      })
    },
  },
}
