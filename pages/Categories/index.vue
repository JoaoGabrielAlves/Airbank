<template>
  <Table title="Categories" description="List of categories" name="category">
    <template slot="header"> </template>
    <template slot="body"> </template>
  </Table>
</template>

<script lang="ts">
export default {
  head() {
    return {
      title: 'Categories',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'List of transaction categories',
        },
      ],
    }
  },
}
</script>
