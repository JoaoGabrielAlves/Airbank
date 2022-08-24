import { resolvers as Account } from './schemas/accounts'
import { resolvers as Category } from './schemas/categories'
import { resolvers as Transaction } from './schemas/transactions'
import merge from 'lodash/merge'

const resolvers = merge(Account, Category, Transaction)

export default resolvers
