import { gql } from 'apollo-server-express'
import { Context } from '../context'
import { Prisma as PrismaTypes } from '@prisma/client'
import { randomUUID } from 'crypto'

export const typeDef = gql`
  extend type Query {
    paginatedTransactions(
      take: Int
      after: String
      search: String
      bank: String
      categoryId: String
      startingMonth: String
      endingMonth: String
      sortField: String
      sortDirection: String
    ): TransactionResponse

    transactionsCount: Count

    transactionById(id: String!): Transaction
  }

  extend type Mutation {
    updateTransactionCategory(
      transactionId: String!
      categoryName: String!
    ): Transaction
  }

  type Transaction {
    id: String!
    reference: String
    date: String!
    amount: Float!
    currency: String!
    Category: Category
    Account: Account
  }

  type TransactionEdge {
    cursor: String
    node: Transaction
  }

  type TransactionResponse {
    pageInfo: CursorPaginationPageInfo
    edges: [TransactionEdge]
  }
`

export const resolvers = {
  Query: {
    paginatedTransactions: async (
      _parent: Object,
      _args: {
        take: number
        after: string
        search: string
        bank: string
        categoryId: string
        startingMonth: string
        endingMonth: string
        sortField: 'date'
        sortDirection: 'asc' | 'desc'
      },
      context: Context
    ) => {
      let queryResults = null

      const search = filterString(_args.search)

      const fullTextSearch = stringToFulltextSearch(search)

      const searchQuery = search
        ? [
            {
              reference: {
                search: fullTextSearch,
              },
            },
            {
              currency: {
                search: fullTextSearch,
              },
            },
            {
              amount: {
                in: stringToFloat(search),
              },
            },
            {
              Category: {
                name: {
                  startsWith: search,
                },
              },
            },
            {
              Account: {
                bank: {
                  startsWith: search,
                },
              },
            },
            {
              Account: {
                name: {
                  startsWith: search,
                },
              },
            },
          ]
        : undefined

      const categoryId = filterString(_args.categoryId)

      const bank = filterString(_args.bank)

      const startingMonth = filterString(_args.startingMonth)

      const endingMonth = filterString(_args.endingMonth)

      const hasFilter =
        !!categoryId || !!bank || !!startingMonth || !!endingMonth

      const dateFilter = getDateFilter(startingMonth, endingMonth)

      const accountBankFilter = bank
        ? {
            bank: bank,
          }
        : undefined

      const filterQuery = hasFilter
        ? {
            categoryId: categoryId,
            Account: accountBankFilter,
            date: dateFilter,
          }
        : undefined

      const whereQuery = {
        OR: searchQuery,
        AND: filterQuery,
      }

      const afterCursor = _args.after
        ? {
            id: _args.after,
          }
        : undefined

      const orderBy = _args.sortField
        ? {
            [_args.sortField]: _args.sortDirection,
          }
        : undefined

      queryResults = await context.prisma.transaction.findMany({
        take: _args.take,
        skip: _args.after ? 1 : undefined,
        include: {
          Category: true,
        },
        cursor: afterCursor,
        where: whereQuery,
        orderBy: orderBy,
      })

      if (queryResults.length > 0) {
        const lastTransactionInResults = queryResults[queryResults.length - 1]

        const endCursor = lastTransactionInResults.id

        const secondQueryCount = await context.prisma.transaction.count({
          take: _args.take,
          cursor: {
            id: endCursor,
          },
          where: whereQuery,
        })

        const result = {
          pageInfo: {
            endCursor: endCursor,
            hasNextPage: secondQueryCount >= _args.take,
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
    transactionsCount: async (_parent: Object, _args: {}, context: Context) => {
      return await context.prisma.transaction.count({
        select: {
          _all: true,
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

      const category = await context.prisma.category.upsert({
        where: {
          name: _args.categoryName,
        },
        update: {},
        create: {
          id: randomUUID(),
          name: _args.categoryName,
          color: randomColor,
        },
      })

      return await context.prisma.transaction.update({
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
      })
    },
  },
}

function filterString(string: string) {
  return string != '' ? string : undefined
}

function stringToFloat(string: string | undefined) {
  const nomNumbersOrOperators = /[^0-9.-]/g

  if (typeof string == 'undefined') {
    return undefined
  }

  return filterString(string.replace(nomNumbersOrOperators, ''))
}

function stringToFulltextSearch(string: string | undefined) {
  const tsQuerySpecialChars = /[()|&:*!]/g

  return string
    ? string
        ?.replace(tsQuerySpecialChars, ' ')
        .trim()
        .split(/\s+/)
        .join(' <-> ')
    : undefined
}

function getDateFilter(
  startingMonth: string | undefined,
  endingMonth: string | undefined
) {
  if (!startingMonth && !endingMonth) {
    return undefined
  }

  let filter = {} as { gte: string; lte: string }

  if (startingMonth) {
    filter.gte = new Date(startingMonth).toISOString()
  }

  if (endingMonth) {
    filter.lte = new Date(endingMonth).toISOString()
  }

  return filter
}
