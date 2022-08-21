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
    paginatedCategories: async (
      _parent: Object,
      _args: { first: number; after: string }
    ) => {
      let queryResults = null

      if (_args.after) {
        queryResults = await prisma.category.findMany({
          take: _args.first,
          skip: 1,
          cursor: {
            id: _args.after,
          },
        })
      } else {
        queryResults = await prisma.category.findMany({
          take: _args.first,
        })
      }

      if (queryResults.length > 0) {
        const lastCategoryInResults = queryResults[queryResults.length - 1]

        const endCursor = lastCategoryInResults.id

        const secondQueryResults = await prisma.category.findMany({
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

          edges: queryResults.map((category) => ({
            cursor: category.id,
            node: category,
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
    paginatedTransactions: async (
      _parent: Object,
      _args: { first: number; after: string; search: string }
    ) => {
      let queryResults = null

      if (_args.after) {
        queryResults = await prisma.transaction.findMany({
          take: _args.first,
          skip: 1,
          cursor: {
            id: _args.after,
          },
          include: {
            Category: true,
          },
          where: {
            OR: [
              {
                reference: {
                  startsWith: _args.search,
                  mode: 'insensitive',
                },
              },
              {
                date: {
                  startsWith: _args.search,
                  mode: 'insensitive',
                },
              },
              {
                amount: {
                  startsWith: _args.search,
                  mode: 'insensitive',
                },
              },
              {
                currency: {
                  startsWith: _args.search,
                  mode: 'insensitive',
                },
              },
              {
                Category: {
                  name: {
                    startsWith: _args.search,
                    mode: 'insensitive',
                  },
                },
              },
              {
                Account: {
                  bank: {
                    startsWith: _args.search,
                    mode: 'insensitive',
                  },
                  name: {
                    startsWith: _args.search,
                    mode: 'insensitive',
                  },
                },
              },
            ],
          },
        })
      } else {
        queryResults = await prisma.transaction.findMany({
          take: _args.first,
          include: {
            Category: true,
          },
          where: {
            OR: [
              {
                reference: {
                  startsWith: _args.search,
                  mode: 'insensitive',
                },
              },
              {
                date: {
                  startsWith: _args.search,
                  mode: 'insensitive',
                },
              },
              {
                amount: {
                  startsWith: _args.search,
                  mode: 'insensitive',
                },
              },
              {
                currency: {
                  startsWith: _args.search,
                  mode: 'insensitive',
                },
              },
              {
                Category: {
                  name: {
                    startsWith: _args.search,
                    mode: 'insensitive',
                  },
                },
              },
              {
                Account: {
                  bank: {
                    startsWith: _args.search,
                    mode: 'insensitive',
                  },
                  name: {
                    startsWith: _args.search,
                    mode: 'insensitive',
                  },
                },
              },
            ],
          },
        })
      }

      if (queryResults.length > 0) {
        const lastTransactionInResults = queryResults[queryResults.length - 1]

        const endCursor = lastTransactionInResults.id

        const secondQueryResults = await prisma.transaction.findMany({
          take: _args.first,
          cursor: {
            id: endCursor,
          },
          include: {
            Category: true,
          },
          where: {
            OR: [
              {
                reference: {
                  startsWith: _args.search,
                  mode: 'insensitive',
                },
              },
              {
                date: {
                  startsWith: _args.search,
                  mode: 'insensitive',
                },
              },
              {
                amount: {
                  startsWith: _args.search,
                  mode: 'insensitive',
                },
              },
              {
                currency: {
                  startsWith: _args.search,
                  mode: 'insensitive',
                },
              },
              {
                Category: {
                  name: {
                    startsWith: _args.search,
                    mode: 'insensitive',
                  },
                },
              },
              {
                Account: {
                  bank: {
                    startsWith: _args.search,
                    mode: 'insensitive',
                  },
                  name: {
                    startsWith: _args.search,
                    mode: 'insensitive',
                  },
                },
              },
            ],
          },
        })

        const result = {
          pageInfo: {
            endCursor: endCursor,
            hasNextPage: secondQueryResults.length >= _args.first,
          },

          edges: queryResults.map((transaction) => ({
            cursor: transaction.id,
            node: transaction,
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
    accountsCount: async (_parent: Object, _args: {}) => {
      return await prisma.account.count({
        select: {
          _all: true,
        },
      })
    },
    categoriesCount: async (_parent: Object, _args: {}) => {
      return await prisma.category.count({
        select: {
          _all: true,
        },
      })
    },
    transactionsCount: async (_parent: Object, _args: {}) => {
      return await prisma.transaction.count({
        select: {
          _all: true,
        },
      })
    },
    transactionById: async (_parent: Object, _args: { id: string }) => {
      return await prisma.transaction.findUnique({
        where: {
          id: _args.id,
        },
        include: {
          Category: true,
          Account: true,
        },
      })
    },
  },
}

export default resolvers
