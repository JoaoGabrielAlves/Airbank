import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const resolvers = {
  Query: {
    allAccounts: (_parent: any, _args: any) => {
      return prisma.account.findMany({
        take: 10,
      })
    },
    allCategories: (_parent: any, _args: any) => {
      return prisma.category.findMany({
        take: 10,
      })
    },
  },
}

export default resolvers
