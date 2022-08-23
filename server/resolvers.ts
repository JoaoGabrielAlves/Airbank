import { Prisma as PrismaTypes } from '@prisma/client'
import { randomUUID } from 'crypto'
import { Context } from './context'

const resolvers = {
  Query: {
    paginatedAccounts: async (
      _parent: Object,
      _args: { first: number; after: string },
      context: Context
    ) => {
      let queryResults = null

      const afterCursor = _args.after
        ? {
            id: _args.after,
          }
        : undefined

      queryResults = await context.prisma.account.findMany({
        take: _args.first,
        skip: _args.after ? 1 : undefined,
        cursor: afterCursor,
      })

      if (queryResults.length > 0) {
        const lastAccountInResults = queryResults[queryResults.length - 1]

        const endCursor = lastAccountInResults.id

        const secondQueryCount = await context.prisma.account.count({
          take: _args.first,
          cursor: {
            id: endCursor,
          },
        })

        const result = {
          pageInfo: {
            endCursor: endCursor,
            hasNextPage: secondQueryCount >= _args.first,
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
      _args: { first: number; after: string },
      context: Context
    ) => {
      let queryResults = null

      const afterCursor = _args.after
        ? {
            id: _args.after,
          }
        : undefined

      queryResults = await context.prisma.category.findMany({
        take: _args.first,
        skip: _args.after ? 1 : undefined,
        cursor: afterCursor,
      })

      if (queryResults.length > 0) {
        const lastCategoryInResults = queryResults[queryResults.length - 1]

        const endCursor = lastCategoryInResults.id

        const secondQueryCount = await context.prisma.category.count({
          take: _args.first,
          cursor: {
            id: endCursor,
          },
        })

        const result = {
          pageInfo: {
            endCursor: endCursor,
            hasNextPage: secondQueryCount >= _args.first,
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
        sortField: 'amount' | 'date' | 'id'
        sortDirection: 'asc' | 'desc'
      },
      context: Context
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

      const afterCursor = _args.after
        ? {
            id: _args.after,
          }
        : undefined

      const whereQuery = {
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
      }

      const orderBy = _args.sortField
        ? {
            [_args.sortField]: _args.sortDirection,
          }
        : undefined

      queryResults = await context.prisma.transaction.findMany({
        take: _args.first,
        skip: _args.after ? 1 : undefined,
        cursor: afterCursor,
        include: {
          Category: true,
        },
        where: whereQuery,
        orderBy: orderBy,
      })

      if (queryResults.length > 0) {
        const lastTransactionInResults = queryResults[queryResults.length - 1]

        const endCursor = lastTransactionInResults.id

        const secondQueryResults = await context.prisma.transaction.count({
          take: _args.first,
          cursor: {
            id: endCursor,
          },
          where: whereQuery,
        })

        const result = {
          pageInfo: {
            endCursor: endCursor,
            hasNextPage: secondQueryResults >= _args.first,
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
    accountsCount: async (_parent: Object, _args: {}, context: Context) => {
      return await context.prisma.account.count({
        select: {
          _all: true,
        },
      })
    },
    categoriesCount: async (_parent: Object, _args: {}, context: Context) => {
      return await context.prisma.category.count({
        select: {
          _all: true,
        },
      })
    },
    transactionsCount: async (_parent: Object, _args: {}, context: Context) => {
      return await context.prisma.transaction.count({
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
    autocompleteCategory: async (
      _parent: Object,
      _args: { search: string },
      context: Context
    ) => {
      if (!_args.search) {
        return []
      }

      return context.prisma.category.findMany({
        where: {
          name: {
            startsWith: _args.search,
            mode: 'insensitive',
          },
        },
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
    categoryById: async (
      _parent: Object,
      _args: { id: string },
      context: Context
    ) => {
      return await context.prisma.category.findUnique({
        where: {
          id: _args.id,
        },
      })
    },
    transactionById: async (
      _parent: Object,
      _args: { id: string },
      context: Context
    ) => {
      return await context.prisma.transaction.findUnique({
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
      _args: { transactionId: string; categoryName: string },
      context: Context
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

      const category = await context.prisma.category.upsert(categoryUpsert)

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

      return await context.prisma.transaction.update(accountUpdate)
    },
  },
}

export default resolvers
