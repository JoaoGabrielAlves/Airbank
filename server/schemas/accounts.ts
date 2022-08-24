import { gql } from 'apollo-server-express'
import { Context } from '../context'

export const typeDef = gql`
  extend type Query {
    paginatedAccounts(
      take: Int
      page: Int!
      sortField: String
      sortDirection: String
    ): AccountResponse

    autocompleteAccountBanks(search: String): [Account]

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
      _args: {
        take: number
        page: number
        sortField: 'name' | 'bank'
        sortDirection: 'asc' | 'desc'
      },
      context: Context
    ) => {
      let queryResults = null

      const orderBy = _args.sortField
        ? {
            [_args.sortField]: _args.sortDirection,
          }
        : undefined

      const skip = _args.take * (_args.page - 1)

      queryResults = await context.prisma.account.findMany({
        take: _args.take,
        skip: skip,
        orderBy: orderBy,
      })

      if (queryResults.length > 0) {
        const accountsCount = await context.prisma.account.count()

        const result = {
          pageInfo: {
            hasNextPage: accountsCount > skip + _args.take,
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
      _args: { search: string },
      context: Context
    ) => {
      if (!_args.search) {
        return []
      }

      return context.prisma.account.findMany({
        where: {
          bank: {
            startsWith: _args.search,
            mode: 'insensitive',
          },
        },
        distinct: ['bank'],
      })
    },
    accountById: async (
      _parent: Object,
      _args: { id: string },
      context: Context
    ) => {
      return await context.prisma.account.findUnique({
        where: {
          id: _args.id,
        },
      })
    },
  },
}
