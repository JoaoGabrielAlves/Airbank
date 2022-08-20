const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const cors = require('cors')

import typeDefs from './typeDefs'

import resolvers from './resolvers'

const server = new ApolloServer({ typeDefs, resolvers })

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
