import { gql } from 'apollo-server-express'
import { Context } from '../context'

export const typeDef = gql`
  extend type Query {
    paginatedCategories(
      take: Int
      page: Int!
      sortField: String
      sortDirection: String
    ): CategoryResponse

    autocompleteCategory(search: String): [Category]

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
      _args: {
        take: number
        page: number
        sortField: 'name'
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

      queryResults = await context.prisma.category.findMany({
        take: _args.take,
        skip: skip,
        orderBy: orderBy,
      })

      if (queryResults.length > 0) {
        const categoriesCount = await context.prisma.category.count()

        const result = {
          pageInfo: {
            hasNextPage: categoriesCount > skip + _args.take,
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
  },
}
