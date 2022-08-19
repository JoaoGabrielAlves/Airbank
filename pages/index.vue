<template>
  <Table
    title="Transactions"
    description="List of transactions"
    name="transaction"
  >
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
