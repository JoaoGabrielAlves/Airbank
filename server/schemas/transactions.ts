import { gql } from 'apollo-server-express'
import { Context } from '../context'
import { randomUUID } from 'crypto'
import { Prisma } from '@prisma/client'
import moment from 'moment'
import {
  QueryPaginatedTransactionsArgs,
  QueryTransactionByIdArgs,
  UpdateTransactionCategoryMutationVariables,
  InputMaybe,
} from '../../static/types/generated'

export const typeDef = gql`
  extend type Query {
    paginatedTransactions(
      take: Int!
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

export const resolvers = {
  Query: {
    paginatedTransactions: async (
      _parent: Object,
      args: QueryPaginatedTransactionsArgs,
      context: Context
    ) => {
      const search = filterString(args.search)

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

      const categoryId = filterString(args.categoryId)

      const bank = filterString(args.bank)

      const startingMonth = filterString(args.startingMonth)

      const endingMonth = filterString(args.endingMonth)

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

      if (args.page) {
        return offsetPaginate(args, context, whereQuery)
      }

      return cursorPaginate(args, context, whereQuery)
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
      args: QueryTransactionByIdArgs,
      context: Context
    ) => {
      return await context.prisma.transaction.findUnique({
        where: {
          id: args.id,
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
      args: UpdateTransactionCategoryMutationVariables,
      context: Context
    ) => {
      let randomColor = Math.floor(Math.random() * 16777215).toString(16)

      const category = await context.prisma.category.upsert({
        where: {
          name: args.categoryName,
        },
        update: {},
        create: {
          id: randomUUID(),
          name: args.categoryName,
          color: randomColor,
        },
      })

      return await context.prisma.transaction.update({
        where: {
          id: args.transactionId,
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

function filterString(string: InputMaybe<string> | undefined) {
  if (typeof string === 'undefined') {
    return undefined
  }

  return string != '' ? string : undefined
}

function filterStringToFloat(string: string) {
  const isValid = /^-?[0-9]\d*(\.\d+)?$/.test(string)

  if (isValid) {
    return string
  }

  return undefined
}

function stringToFulltextSearch(string: InputMaybe<string> | undefined) {
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
  const isValidYearMonthDay = moment(search, 'YYYY-MM-DD', true).isValid()
  const isValidDayMonthYear = moment(search, 'DD/MM/YY', true).isValid()

  if (!isValidYearMonthDay && !isValidDayMonthYear) {
    return undefined
  }

  if (isValidYearMonthDay) {
    const startOfTheDay = moment(search, 'YYYY-MM-DD')
      .utc()
      .startOf('D')
      .toISOString()

    const endOfTheDay = moment(search, 'YYYY-MM-DD')
      .utc()
      .endOf('D')
      .toISOString()

    return {
      gte: startOfTheDay,
      lte: endOfTheDay,
    }
  }

  const startOfTheDay = moment(search, 'DD/MM/YY')
    .utc()
    .startOf('D')
    .toISOString()

  const endOfTheDay = moment(search, 'DD/MM/YY').utc().endOf('D').toISOString()

  return {
    gte: startOfTheDay,
    lte: endOfTheDay,
  }
}

function getDateFilter(
  startingMonth: InputMaybe<string> | undefined,
  endingMonth: InputMaybe<string> | undefined
) {
  if (!startingMonth && !endingMonth) {
    return undefined
  }

  let filter = {} as { gte: string; lte: string }

  if (startingMonth) {
    filter.gte = moment(startingMonth, 'YYYY-MM', true)
      .utc()
      .startOf('M')
      .toISOString()
  }

  if (endingMonth) {
    filter.lte = moment(endingMonth, 'YYYY-MM', true)
      .utc()
      .endOf('M')
      .toISOString()
  }

  return filter
}

async function offsetPaginate(
  args: QueryPaginatedTransactionsArgs,
  context: Context,
  whereQuery: Prisma.TransactionWhereInput
) {
  let queryResults = null

  const skip = args.take * ((args.page ?? 1) - 1)

  queryResults = await context.prisma.transaction.findMany({
    take: args.take,
    skip: skip,
    include: {
      Category: true,
    },
    where: whereQuery,
    orderBy: args.sortField
      ? {
          [args.sortField]: args.sortDirection,
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
        hasNextPage: transactionCount > skip + args.take,
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
  args: QueryPaginatedTransactionsArgs,
  context: Context,
  whereQuery: Prisma.TransactionWhereInput
) {
  let queryResults = null

  queryResults = await context.prisma.transaction.findMany({
    take: args.take,
    skip: args.skip ? 1 : undefined,
    include: {
      Category: true,
    },
    cursor: args.skip
      ? {
          id: args.skip,
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
      take: args.take,
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
        hasNextPage: secondQueryCount >= args.take,
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
