import { PrismaClient, Prisma as PrismaTypes } from '@prisma/client'
import { randomUUID } from 'crypto'

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
      _args: {
        first: number
        after: string
        search: string
        bank: string
        categoryId: string
        startingMonth: string
        endingMonth: string
      }
    ) => {
      let queryResults = null

      const tsquerySpecialChars = /[()|&:*!]/g

      let search =
        _args.search != ''
          ? _args.search
              ?.replace(tsquerySpecialChars, ' ')
              .trim()
              .split(/\s+/)
              .join(' | ')
          : undefined

      let categoryId = _args.categoryId != '' ? _args.categoryId : undefined

      let bank = _args.bank != '' ? _args.bank : undefined

      let startingMonth =
        _args.startingMonth != '' ? _args.startingMonth : undefined

      let endingMonth = _args.endingMonth != '' ? _args.endingMonth : undefined

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
                  search: search,
                },
              },
              {
                date: {
                  search: search,
                },
              },
              {
                amount: {
                  search: search,
                },
              },
              {
                currency: {
                  search: search,
                },
              },
              {
                Category: {
                  name: {
                    search: search,
                  },
                },
              },
              {
                Account: {
                  bank: {
                    search: search,
                  },
                  name: {
                    search: search,
                  },
                },
              },
            ],
            AND: {
              categoryId: categoryId,
              Account: {
                bank: bank,
              },
              date: {
                gte: startingMonth,
                lte: endingMonth,
              },
            },
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
                  search: search,
                },
              },
              {
                date: {
                  search: search,
                },
              },
              {
                amount: {
                  search: search,
                },
              },
              {
                currency: {
                  search: search,
                },
              },
              {
                Category: {
                  name: {
                    search: search,
                  },
                },
              },
              {
                Account: {
                  bank: {
                    search: search,
                  },
                  name: {
                    search: search,
                  },
                },
              },
            ],
            AND: {
              categoryId: categoryId,
              Account: {
                bank: bank,
              },
              date: {
                gte: startingMonth,
                lte: endingMonth,
              },
            },
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
                  search: search,
                },
              },
              {
                date: {
                  search: search,
                },
              },
              {
                amount: {
                  search: search,
                },
              },
              {
                currency: {
                  search: search,
                },
              },
              {
                Category: {
                  name: {
                    search: search,
                  },
                },
              },
              {
                Account: {
                  bank: {
                    search: search,
                  },
                  name: {
                    search: search,
                  },
                },
              },
            ],
            AND: {
              categoryId: categoryId,
              Account: {
                bank: bank,
              },
              date: {
                gte: startingMonth,
                lte: endingMonth,
              },
            },
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
    autocompleteAccountBanks: async (
      _parent: Object,
      _args: { search: string }
    ) => {
      if (!_args.search) {
        return []
      }

      return prisma.account.findMany({
        where: {
          bank: {
            startsWith: _args.search,
          },
        },
        distinct: ['bank'],
      })
    },
    autocompleteCategory: async (
      _parent: Object,
      _args: { search: string }
    ) => {
      if (!_args.search) {
        return []
      }

      return prisma.category.findMany({
        where: {
          name: {
            startsWith: _args.search,
          },
        },
      })
    },
    accountById: async (_parent: Object, _args: { id: string }) => {
      return await prisma.account.findUnique({
        where: {
          id: _args.id,
        },
      })
    },
    categoryById: async (_parent: Object, _args: { id: string }) => {
      return await prisma.category.findUnique({
        where: {
          id: _args.id,
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
  Mutation: {
    updateTransactionCategory: async (
      _parent: Object,
      _args: { transactionId: string; categoryName: string }
    ) => {
      let randomColor = Math.floor(Math.random() * 16777215).toString(16)

      const categoryUpsert: PrismaTypes.CategoryUpsertArgs = {
        where: {
          name: _args.categoryName,
        },
        update: {},
        create: {
          id: randomUUID(),
          name: _args.categoryName,
          color: randomColor,
        },
      }

      const category = await prisma.category.upsert(categoryUpsert)

      const accountUpdate: PrismaTypes.TransactionUpdateArgs = {
        where: {
          id: _args.transactionId,
        },
        data: {
          categoryId: category.id,
        },
        include: {
          Category: true,
          Account: true,
        },
      }

      return await prisma.transaction.update(accountUpdate)
    },
  },
}

export default resolvers
