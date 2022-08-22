<template>
  <div>
    <Table
      title="Transactions"
      :isLoading="$apollo.queries.paginatedTransactions.loading"
      description="List of transactions including their reference, category, date and amount"
      :hasData="paginatedTransactions?.edges.length > 0"
    >
      <template slot="filters">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Input
            leadingIcon
            label="Search"
            placeholder="Search"
            name="search"
            @change="search = $event"
            :disabled="$apollo.queries.paginatedTransactions.loading"
          >
            <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current text-gray-500">
              <path
                d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"
              ></path>
            </svg>
          </Input>
          <AutoComplete
            :disabled="$apollo.queries.paginatedTransactions.loading"
            name="Banks"
            :options="autocompleteAccountBanks"
            optionValueKey="bank"
            optionIdentifierKey="bank"
            @change="bankSearch = $event"
            @selected="bank = $event"
          />
          <AutoComplete
            :disabled="$apollo.queries.paginatedTransactions.loading"
            name="Category"
            :options="autocompleteCategory"
            optionValueKey="name"
            optionIdentifierKey="id"
            @change="categorySearch = $event"
            @selected="selectedCategoryId = $event"
          />
          <Input
            trailingIcon
            label="Starting month"
            placeholder="yyyy-mm"
            name="starting_month"
            @change="startingMonth = $event"
            :disabled="$apollo.queries.paginatedTransactions.loading"
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
          </Input>
          <Input
            trailingIcon
            label="Ending month"
            placeholder="yyyy-mm"
            name="ending_month"
            @change="endingMonth = $event"
            :disabled="$apollo.queries.paginatedTransactions.loading"
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
          </Input>
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
    <Pagination
      v-if="paginatedTransactions?.edges.length > 0"
      :disabled="$apollo.queries.paginatedTransactions.loading"
      :resource="paginatedTransactions"
      @showMore="showMore"
    />
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
      categorySearch: '',
      selectedCategoryId: '',
      startingMonth: '',
      endingMonth: '',
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
    view(id: string) {
      this.$router.push(`/transactions/${id}`)
    },
    showMore(endCursor: string) {
      this.$apollo.queries.paginatedTransactions.fetchMore({
        variables: {
          linksAfter: endCursor,
          search: this.search,
          bank: this.bank,
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
          startingMonth: this.startingMonth,
          endingMonth: this.endingMonth,
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
    reloadCategory() {
      this.$apollo.queries.autocompleteCategory.fetchMore({
        variables: {
          search: this.categorySearch,
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
    categorySearch() {
      this.reloadCategory()
    },
    bank() {
      this.applyFilters()
    },
    selectedCategoryId() {
      this.applyFilters()
    },
    startingMonth() {
      this.applyFilters()
    },
    endingMonth() {
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
          $startingMonth: String
          $endingMonth: String
        ) {
          paginatedTransactions(
            first: $linksFirst
            after: $linksAfter
            search: $search
            bank: $bank
            categoryId: $categoryId
            startingMonth: $startingMonth
            endingMonth: $endingMonth
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
    autocompleteCategory: {
      query: gql`
        query ($search: String) {
          autocompleteCategory(search: $search) {
            id
            name
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
