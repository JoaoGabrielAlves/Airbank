import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const resolvers = {
  Query: {
    allAccounts: (_parent: any, _args: any) => {
      return prisma.account.findMany({
        skip: 10,
        take: 10,
      })
    },
  },
}

export default resolvers
