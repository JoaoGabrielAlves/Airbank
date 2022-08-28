import { gql } from 'apollo-server-express'
import { Context } from '../context'
import {
  QueryAutocompleteCategoryArgs,
  QueryPaginatedCategoriesArgs,
  QueryCategoryByIdArgs,
} from '../../static/types/generated'

export const typeDef = gql`
  extend type Query {
    paginatedCategories(
      take: Int!
      page: Int!
      sortField: String
      sortDirection: String
    ): CategoryResponse

    autocompleteCategory(search: String!): [Category]

    categoriesCount: Count

    categoryById(id: String!): Category
  }

  type Category {
    id: String!
    name: String!
    color: String
  }

  type CategoryEdge {
    node: Category
  }

  type CategoryResponse {
    pageInfo: OffsetPaginationInfo
    edges: [CategoryEdge]
  }
`

export const resolvers = {
  Query: {
    paginatedCategories: async (
      _parent: Object,
      args: QueryPaginatedCategoriesArgs,
      context: Context
    ) => {
      let queryResults = null

      const orderBy = args.sortField
        ? {
            [args.sortField]: args.sortDirection,
          }
        : undefined

      const skip = args.take * (args.page - 1)

      queryResults = await context.prisma.category.findMany({
        take: args.take,
        skip: skip,
        orderBy: orderBy,
      })

      if (queryResults.length > 0) {
        const categoriesCount = await context.prisma.category.count()

        const result = {
          pageInfo: {
            hasNextPage: categoriesCount > skip + args.take,
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
    categoriesCount: async (_parent: Object, _args: {}, context: Context) => {
      return await context.prisma.category.count({
        select: {
          _all: true,
        },
      })
    },
    autocompleteCategory: async (
      _parent: Object,
      args: QueryAutocompleteCategoryArgs,
      context: Context
    ) => {
      return context.prisma.category.findMany({
        where: {
          name: {
            startsWith: args.search,
            mode: 'insensitive',
          },
        },
      })
    },
    categoryById: async (
      _parent: Object,
      args: QueryCategoryByIdArgs,
      context: Context
    ) => {
      return await context.prisma.category.findUnique({
        where: {
          id: args.id,
        },
      })
    },
  },
}
