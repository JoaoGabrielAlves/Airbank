# Airbank code test

This project its a simple SPA application to visualize financial transactions.

![Airbank Project](static/airbank.png)

## Tech stack

- Vue
- Nuxt
- TailwindCSS
- Apollo GraphQL (using @nuxt/apollo wrapper)
- Node
- Typescript
- Prisma
- PostgreSQL

## Setup

To setup this project you will need to have PostgreSQL and Node set up
in your machine. Before running any commands on your terminal prisma
needs you to specify a PostgreSQL connection url. In this project you will need to
create a .env file and put your connection url on DATABASE_URL like in
the example bellow. You can find more about PostgreSQL connection ulrs on prima [documentation](https://nuxtjs.org/docs/2.x/directory-structure/components)

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/airbank"
```

After configuring your local environment, you can run those commands in order to set up your project and your database:

```bash
# install dependencies
$ npm install

# set up database
$ npm run setup:database

# start serve with hot reload at localhost:3000
$ npm run dev
```
