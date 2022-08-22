<template>
  <div>
    <Table
      title="Transactions"
      description="List of transactions including their reference, category, date and amount"
      :hasData="paginatedTransactions?.edges.length > 0"
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
          <AutoComplete
            name="Banks"
            :options="autocompleteAccountBanks"
            optionValueKey="bank"
            optionIdentifierKey="bank"
            @update="bankSearch = $event"
            @selected="bank = $event?.bank"
          />
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
      bankSearch: '',
      bank: '',
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
          bank: this.bank,
          categoryId: this.selectedCategoryId,
        },
        // @ts-ignore
        updateQuery: (previousResult, { fetchMoreResult }) => {
          return fetchMoreResult
        },
      })
    },
    reloadBanks() {
      this.$apollo.queries.autocompleteAccountBanks.fetchMore({
        variables: {
          search: this.bankSearch,
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
    bankSearch() {
      this.reloadBanks()
    },
    bank() {
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
          $bank: String
          $categoryId: String
        ) {
          paginatedTransactions(
            first: $linksFirst
            after: $linksAfter
            search: $search
            bank: $bank
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
    autocompleteAccountBanks: {
      query: gql`
        query ($search: String) {
          autocompleteAccountBanks(search: $search) {
            bank
          }
        }
      `,
      variables: {
        search: '',
      },
    },
  },
})
</script>
