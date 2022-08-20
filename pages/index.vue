<template>
  <Table
    title="Transactions"
    description="List of transactions"
    name="transaction"
  >
    <template slot="header">
      <TableHead title="Reference" :isFirst="false" />
      <TableHead title="Category" />
      <TableHead title="Date" />
      <TableHead title="Amount" />
    </template>
    <template slot="body">
      <tr
        v-for="transaction in allTransactions"
        :key="transaction.id"
        class="cursor-pointer hover:bg-gray-50"
      >
        <TableColumn :isFirst="true">
          <span v-if="transaction.reference">
            {{ transaction.reference }}
          </span>

          <span v-else class="text-sm text-gray-500">
            No reference provided
          </span>
        </TableColumn>
        <TableColumn>
          <Badge :color="transaction.Category?.color" text="">
            {{
              transaction.Category?.name
                ? transaction.Category?.name
                : transaction.Category?.color
            }}
          </Badge>
        </TableColumn>
        <TableColumn>
          {{ transaction.date }}
        </TableColumn>
        <TableColumn>
          {{ transaction.amount }}
          <span class="text-xs text-gray-400">
            {{ transaction.currency }}
          </span>
        </TableColumn>
      </tr>
    </template>
  </Table>
</template>

<script lang="ts">
import gql from 'graphql-tag'
import Badge from '~/components/Badge.vue'

export default {
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
      window.location.href = `transactions/${id}`
    },
  },
  apollo: {
    allTransactions: gql`
      query {
        allTransactions {
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
    `,
  },
  components: { Badge },
}
</script>
