import { gql } from 'apollo-server-express'
import { Context } from '../context'
import { randomUUID } from 'crypto'
import { Prisma } from '@prisma/client'
import moment from 'moment'

export const typeDef = gql`
  extend type Query {
    paginatedTransactions(
      take: Int
      page: Int
      skip: String
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

type paginatedTransactionsArgs = {
  take: number
  skip: string
  page: number
  search: string
  bank: string
  categoryId: string
  startingMonth: string
  endingMonth: string
  sortField: 'date' | 'amount'
  sortDirection: 'asc' | 'desc'
}

export const resolvers = {
  Query: {
    paginatedTransactions: async (
      _parent: Object,
      _args: paginatedTransactionsArgs,
      context: Context
    ) => {
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
                in: filterStringToFloat(search),
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
              date: getDateSearch(search),
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

      if (_args.page) {
        return offsetPaginate(_args, context, whereQuery)
      }

      return cursorPaginate(_args, context, whereQuery)
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

function filterStringToFloat(string: string) {
  const isValid = /^-?[0-9]\d*(\.\d+)?$/.test(string)

  if (isValid) {
    return string
  }

  return undefined
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

function getDateSearch(search: string) {
  const isValid =
    moment(search, 'YYYY-MM-DD', true).isValid() ||
    moment(search, 'DD/MM/YY', true).isValid()

  if (!isValid) {
    return undefined
  }

  const date = new Date(search)

  const startOfTheDay = new Date(date.setUTCHours(0, 0, 0, 0)).toISOString()

  const endOfTheDay = new Date(date.setUTCHours(23, 59, 59, 999)).toISOString()

  return {
    gte: startOfTheDay,
    lte: endOfTheDay,
  }
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
    let endDateBegningOfTheMonth = new Date(endingMonth)

    let endDateEndOfTheMonth = new Date(
      endDateBegningOfTheMonth.getFullYear(),
      endDateBegningOfTheMonth.getMonth() + 2,
      0
    )

    filter.lte = endDateEndOfTheMonth.toISOString()
  }

  return filter
}

async function offsetPaginate(
  _args: paginatedTransactionsArgs,
  context: Context,
  whereQuery: Prisma.TransactionWhereInput
) {
  let queryResults = null

  const skip = _args.take * (_args.page - 1)

  queryResults = await context.prisma.transaction.findMany({
    take: _args.take,
    skip: skip,
    include: {
      Category: true,
    },
    where: whereQuery,
    orderBy: _args.sortField
      ? {
          [_args.sortField]: _args.sortDirection,
        }
      : {
          id: 'asc',
        },
  })

  if (queryResults.length > 0) {
    const transactionCount = await context.prisma.transaction.count({
      where: whereQuery,
    })

    const result = {
      pageInfo: {
        hasNextPage: transactionCount > skip + _args.take,
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
}

async function cursorPaginate(
  _args: paginatedTransactionsArgs,
  context: Context,
  whereQuery: Prisma.TransactionWhereInput
) {
  let queryResults = null

  queryResults = await context.prisma.transaction.findMany({
    take: _args.take,
    skip: _args.skip ? 1 : undefined,
    include: {
      Category: true,
    },
    cursor: _args.skip
      ? {
          id: _args.skip,
        }
      : undefined,
    where: whereQuery,
    orderBy: {
      id: 'asc',
    },
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
      orderBy: {
        id: 'asc',
      },
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
}
