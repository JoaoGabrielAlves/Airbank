<template>
  <div>
    <h1 class="text-4xl">Categories</h1>
  </div>
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
