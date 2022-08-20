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
      <tr @click="view(1)">
        <TableColumn content="Reconcialitory Couche Airing" />
        <TableColumn content="Category" />
        <TableColumn content="14/04/22" />
        <TableColumn aumount="458.00 GBP" />
      </tr>
    </template>
  </Table>
</template>

<script lang="ts">
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
}
</script>
