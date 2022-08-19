<template>
  <div>
    <h1 class="text-4xl">{{ $route.params.id }}</h1>
  </div>
</template>

<script lang="ts">
export default {
  head() {
    return {
      title: 'Category',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Show a category by id',
        },
      ],
    }
  },
}
</script>
