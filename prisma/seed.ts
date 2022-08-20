import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function categories() {
  let data = 'hi'
  console.log(data)
}

// async function accounts() {
//     await prisma.account.create({
//         data:
//     });
// }

// async function transactions() {
//     await prisma.transaction.create({
//         data:
//     });
// }

categories()
  .catch((e) => {
    console.log(e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })

// accounts()
//   .catch((e) => {
//     console.log(e)
//     process.exit(1)
//   })
//   .finally(() => {
//     prisma.$disconnect()
//   })

// transactions()
//   .catch((e) => {
//     console.log(e)
//     process.exit(1)
//   })
//   .finally(() => {
//     prisma.$disconnect()
//   })
