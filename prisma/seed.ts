import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const fs = require('fs')
const csv = require('csv-parser')

interface Category {
  id: string
  name: string
  color: string
}

interface Account {
  id: string
  name: string
  bank: string
}

interface Transaction {
  id: string
  accountId: string
  categoryId: string | null
  reference: string
  amount: string
  currency: string
  date: string
}

function categories() {
  let finalData: Array<Category> = []

  fs.createReadStream(`${__dirname}/csvs/categories.csv`)
    .pipe(
      csv({
        headers: ['id', 'name', 'color'],
        skipLines: 1,
      })
    )
    .on('data', (data: Category) => finalData.push(data))
    .on('end', () => {
      createCategories(finalData).catch((e) => {
        console.log(e)
        process.exit(1)
      })
    })
}

function accounts() {
  let finalData: Array<Account> = []

  fs.createReadStream(`${__dirname}/csvs/accounts.csv`)
    .pipe(
      csv({
        headers: ['id', 'name', 'bank'],
        skipLines: 1,
      })
    )
    .on('data', (data: Account) => finalData.push(data))
    .on('end', () => {
      createAccounts(finalData).catch((e) => {
        console.log(e)
        process.exit(1)
      })
    })
}

function transactions() {
  let finalData: Array<Transaction> = []

  fs.createReadStream(`${__dirname}/csvs/transactions.csv`)
    .pipe(
      csv({
        headers: [
          'id',
          'accountId',
          'categoryId',
          'reference',
          'amount',
          'currency',
          'date',
        ],
        skipLines: 1,
      })
    )
    .on('data', (data: Transaction) =>
      finalData.push({
        ...data,
        date: new Date(data.date).toISOString(),
        categoryId: data.categoryId ? data.categoryId : null,
      })
    )
    .on('end', () => {
      createTransactions(finalData)
        .catch((e) => {
          console.log(e)
          process.exit(1)
        })
        .finally(() => {
          prisma.$disconnect()
        })
    })
}

async function createCategories(finalData: Category[]) {
  await prisma.category.createMany({
    data: finalData,
  })
}

async function createAccounts(finalData: Account[]) {
  await prisma.account.createMany({
    data: finalData,
  })
}

async function createTransactions(finalData: Transaction[]) {
  await prisma.transaction.createMany({
    data: finalData,
  })
}

categories()
accounts()
transactions()
