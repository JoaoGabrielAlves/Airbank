<template>
  <div>
    <Table
      title="Accounts"
      description="List of accounts including their name and bank"
      :hasData="paginatedAccounts?.edges.length > 0"
      :isLoading="$apollo.queries.paginatedAccounts.loading"
    >
      <template slot="header">
        <TableHead
          hasSort
          :sortField="sortField"
          :sortDirection="sortDirection"
          field="name"
          title="Name"
          @click="updateSortFieldAndDirection"
          :loading="$apollo.queries.paginatedAccounts.loading"
          :isFirst="true"
        />
        <TableHead
          hasSort
          :sortField="sortField"
          :sortDirection="sortDirection"
          field="bank"
          title="Bank"
          @click="updateSortFieldAndDirection"
          :loading="$apollo.queries.paginatedAccounts.loading"
          :isFirst="true"
        />
      </template>
      <template slot="body">
        <tr
          class="cursor-pointer hover:bg-gray-50"
          v-for="account in paginatedAccounts?.edges"
          :key="account.node.id"
          @click="view(account.node.id)"
        >
          <TableColumn :isFirst="true">
            {{ account.node.name }}
          </TableColumn>
          <TableColumn>
            {{ account.node.bank }}
          </TableColumn>
        </tr>
      </template>
    </Table>
    <Pagination :resource="paginatedAccounts" @showMore="showMore" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import gql from 'graphql-tag'

export default Vue.extend({
  head() {
    return {
      title: 'Accounts',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'List of accounts',
        },
      ],
    }
  },
  data: () => ({
    sortField: '',
    sortDirection: '',
  }),
  apollo: {
    paginatedAccounts: {
      query: gql`
        query (
          $linksFirst: Int
          $linksAfter: String
          $sortField: String
          $sortDirection: String
        ) {
          paginatedAccounts(
            first: $linksFirst
            after: $linksAfter
            sortField: $sortField
            sortDirection: $sortDirection
          ) {
            pageInfo {
              endCursor
              hasNextPage
            }
            edges {
              cursor
              node {
                id
                name
                bank
              }
            }
          }
        }
      `,
      variables: {
        linksFirst: 10,
      },
    },
  },
  methods: {
    showMore(endCursor: string) {
      this.$apollo.queries.paginatedAccounts.fetchMore({
        variables: {
          linksAfter: endCursor,
          previousEndCursor: endCursor,
        },

        updateQuery: (previousResult, { fetchMoreResult }) => {
          fetchMoreResult.paginatedAccounts.edges = [
            ...previousResult.paginatedAccounts.edges,
            ...fetchMoreResult.paginatedAccounts.edges,
          ]

          return fetchMoreResult
        },
      })
    },
    applyFilters() {
      this.$apollo.queries.paginatedAccounts.fetchMore({
        variables: {
          linksFirst: 10,
          sortField: this.sortField,
          sortDirection: this.sortDirection,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          return fetchMoreResult
        },
      })
    },
    view(id: string) {
      this.$router.push(`/accounts/${id}`)
    },
    updateSortFieldAndDirection(
      direction: 'asc' | 'desc',
      field: 'name' | 'bank'
    ) {
      this.sortDirection = direction
      this.sortField = field

      this.applyFilters()
    },
  },
})
</script>
