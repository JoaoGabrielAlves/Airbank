<template>
  <div>
    <Table
      title="Accounts"
      description="List of accounts including their name and bank"
    >
      <template slot="header">
        <TableHead title="Name" :isFirst="true" />
        <TableHead title="Bank" />
      </template>
      <template slot="body">
        <tr
          class="cursor-pointer hover:bg-gray-50"
          v-for="account in paginatedAccounts?.edges"
          :key="account.node.id"
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
import TableColumn from '~/components/TableColumn.vue'
import TableHead from '~/components/TableHead.vue'
import Pagination from '~/components/Pagination.vue'

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
  components: { TableColumn, TableHead, Pagination },
})
</script>
