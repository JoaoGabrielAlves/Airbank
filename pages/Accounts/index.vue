<template>
  <Table title="Accounts" description="List of accounts" name="account">
  </Table>
</template>

<script lang="ts">
export default {
  head() {
    return {
      title: 'Accounts',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'List of transaction accounts',
        },
      ],
    }
  },
}
</script>
