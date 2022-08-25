import express from 'express'
import cors from 'cors'

import typeDefs from './typeDefs'
import resolvers from './resolvers'

import { ApolloServer } from 'apollo-server-express'
import { context } from './context'

const server = new ApolloServer({ typeDefs, resolvers, context })

const app = express()
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(server.getMiddleware())

module.exports = app
