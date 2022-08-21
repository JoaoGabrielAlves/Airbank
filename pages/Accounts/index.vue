<template>
  <div>
    <Table title="Accounts" description="List of accounts" name="account">
      <template slot="header">
        <TableHead title="Name" :isFirst="true" />
        <TableHead title="Bank" />
      </template>
      <template slot="body">
        <tr
          class="cursor-pointer hover:bg-gray-50"
          v-for="account in paginatedAccounts?.edges"
          :key="account.id"
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
    <div class="flex justify-center items-center py-6">
      <button
        type="button"
        class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        v-if="paginatedAccounts?.pageInfo.hasNextPage"
        @click="showMore(paginatedAccounts.pageInfo.endCursor)"
      >
        Load more
      </button>

      <span v-else> You've reached the end! </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import gql from 'graphql-tag'
import TableColumn from '~/components/TableColumn.vue'
import TableHead from '~/components/TableHead.vue'

export default Vue.extend({
  data: () => ({
    page: 0,
  }),
  apollo: {
    paginatedAccounts: {
      query: gql`
        query ($linksFirst: Int, $linksAfter: String) {
          paginatedAccounts(first: $linksFirst, after: $linksAfter) {
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
  },
  components: { TableColumn, TableHead },
})
</script>
