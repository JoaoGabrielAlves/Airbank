<template>
  <div>
    <Table
      title="Transactions"
      description="List of transactions including their reference, category, date and amount"
    >
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
            <Badge :color="transaction.node.Category?.color" text="">
              {{
                transaction.node.Category?.name
                  ? transaction.node.Category?.name
                  : transaction.node.Category?.color
              }}
            </Badge>
          </TableColumn>
          <TableColumn>
            {{ formatDate(new Date(transaction.node.date)) }}
          </TableColumn>
          <TableColumn>
            <Amount
              containerClass="flex justify-between items-center"
              :amount="transaction?.node.amount"
              :currency="transaction?.node.currency"
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
import Badge from '~/components/Badge.vue'

export default Vue.extend({
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
          previousEndCursor: endCursor,
        },

        updateQuery: (previousResult, { fetchMoreResult }) => {
          fetchMoreResult.paginatedTransactions.edges = [
            ...previousResult.paginatedTransactions.edges,
            ...fetchMoreResult.paginatedTransactions.edges,
          ]

          return fetchMoreResult
        },
      })
    },
    formatDate(date: Date) {
      return [
        this.padTo2Digits(date.getDate()),
        this.padTo2Digits(date.getMonth() + 1),
        date.getFullYear().toString().slice(-2),
      ].join('/')
    },
    padTo2Digits(num: number) {
      return num.toString().padStart(2, '0')
    },
  },
  apollo: {
    paginatedTransactions: {
      query: gql`
        query ($linksFirst: Int, $linksAfter: String) {
          paginatedTransactions(first: $linksFirst, after: $linksAfter) {
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
      },
    },
  },
  components: { Badge },
})
</script>
