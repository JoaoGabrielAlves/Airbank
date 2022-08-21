import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const resolvers = {
  Query: {
    paginatedAccounts: async (
      _parent: Object,
      _args: { first: number; after: string }
    ) => {
      let queryResults = null

      if (_args.after) {
        queryResults = await prisma.account.findMany({
          take: _args.first,
          skip: 1,
          cursor: {
            id: _args.after,
          },
        })
      } else {
        queryResults = await prisma.account.findMany({
          take: _args.first,
        })
      }

      if (queryResults.length > 0) {
        const lastAccountInResults = queryResults[queryResults.length - 1]

        const endCursor = lastAccountInResults.id

        const secondQueryResults = await prisma.account.findMany({
          take: _args.first,
          cursor: {
            id: endCursor,
          },
        })

        const result = {
          pageInfo: {
            endCursor: endCursor,
            hasNextPage: secondQueryResults.length >= _args.first,
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
    allCategories: (_parent: Object, _args: {}) => {
      return prisma.category.findMany({
        take: 10,
      })
    },
    allTransactions: (_parent: Object, _args: {}) => {
      return prisma.transaction.findMany({
        take: 10,
        include: {
          Category: true,
        },
      })
    },
  },
}

export default resolvers
