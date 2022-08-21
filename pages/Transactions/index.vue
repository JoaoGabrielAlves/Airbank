<template>
  <div>
    <Table
      title="Transactions"
      description="List of transactions including their reference, category, date and amount"
    >
      <template slot="filters">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700"
              >Search</label
            >
            <div class="mt-1 relative rounded-md shadow-sm">
              <span
                class="h-full absolute inset-y-0 left-0 flex items-center pl-2"
              >
                <svg
                  viewBox="0 0 24 24"
                  class="h-4 w-4 fill-current text-gray-500"
                >
                  <path
                    d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"
                  ></path>
                </svg>
              </span>
              <input
                v-model.lazy="search"
                placeholder="Search"
                name="search"
                id="search"
                class="appearance-none rounded border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label
              for="stating-month"
              class="block text-sm font-medium text-gray-700"
              >Account</label
            >
            <div class="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                name="stating-month"
                id="stating-month"
                class="appearance-none rounded border border-gray-400 border-b block pl-4 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
                placeholder="yyyy-mm"
              />
              <div
                class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label
              for="stating-month"
              class="block text-sm font-medium text-gray-700"
              >Bank</label
            >
            <div class="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                name="stating-month"
                id="stating-month"
                class="appearance-none rounded border border-gray-400 border-b block pl-4 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
                placeholder="yyyy-mm"
              />
              <div
                class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template slot="header">
        <TableHead title="Reference" :isFirst="true" />
        <TableHead title="Category" />
        <TableHead title="Date" />
        <TableHead title="Amount" />
      </template>
      <template slot="body">
        <tr
          v-for="transaction in paginatedTransactions?.edges"
          :key="transaction.node.id"
          class="cursor-pointer hover:bg-gray-50"
          @click="view(transaction.node.id)"
        >
          <TableColumn :isFirst="true">
            <span v-if="transaction.node.reference">
              {{ transaction.node.reference }}
            </span>

            <span v-else class="text-sm text-gray-500">
              No reference provided
            </span>
          </TableColumn>
          <TableColumn>
            <Badge :color="transaction.node.Category?.color">
              {{
                transaction.node.Category?.name
                  ? transaction.node.Category?.name
                  : transaction.node.Category?.color
              }}
            </Badge>
          </TableColumn>
          <TableColumn>
            <Date :date="transaction.node.date" />
          </TableColumn>
          <TableColumn>
            <Amount
              containerClass="flex justify-between items-center"
              :amount="transaction.node.amount"
              :currency="transaction.node.currency"
            />
          </TableColumn>
        </tr>
      </template>
    </Table>
    <Pagination :resource="paginatedTransactions" @showMore="showMore" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import gql from 'graphql-tag'

export default Vue.extend({
  data() {
    return {
      search: '',
      selectedAccountId: '',
      selectedCategoryId: '',
    }
  },
  head() {
    return {
      title: 'Transactions',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'List of transactions',
        },
      ],
    }
  },
  methods: {
    view(id: number) {
      this.$router.push(`/transactions/${id}`)
    },
    showMore(endCursor: string) {
      this.$apollo.queries.paginatedTransactions.fetchMore({
        variables: {
          linksAfter: endCursor,
          search: this.search,
          accountId: this.selectedAccountId,
          categoryId: this.selectedCategoryId,
        },

        // @ts-ignore
        updateQuery: (previousResult, { fetchMoreResult }) => {
          fetchMoreResult.paginatedTransactions.edges = [
            ...previousResult.paginatedTransactions.edges,
            ...fetchMoreResult.paginatedTransactions.edges,
          ]

          return fetchMoreResult
        },
      })
    },
    applyFilters() {
      this.$apollo.queries.paginatedTransactions.fetchMore({
        variables: {
          linksFirst: 10,
          linksAfter: '',
          search: this.search,
          accountId: this.selectedAccountId,
          categoryId: this.selectedCategoryId,
        },

        // @ts-ignore
        updateQuery: (previousResult, { fetchMoreResult }) => {
          return fetchMoreResult
        },
      })
    },
  },
  watch: {
    search() {
      this.applyFilters()
    },
  },
  apollo: {
    paginatedTransactions: {
      query: gql`
        query (
          $linksFirst: Int
          $linksAfter: String
          $search: String
          $accountId: String
          $categoryId: String
        ) {
          paginatedTransactions(
            first: $linksFirst
            after: $linksAfter
            search: $search
            accountId: $accountId
            categoryId: $categoryId
          ) {
            pageInfo {
              endCursor
              hasNextPage
            }
            edges {
              cursor
              node {
                id
                reference
                date
                amount
                currency
                Category {
                  name
                  color
                }
              }
            }
          }
        }
      `,
      variables: {
        linksFirst: 10,
        search: '',
      },
    },
  },
})
</script>
