<template>
  <Table
    title="Transactions"
    description="List of transactions"
    name="transaction"
  >
    <template slot="header"> </template>
    <template slot="body"> </template>
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
}
</script>
