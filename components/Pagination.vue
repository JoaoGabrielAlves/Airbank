<template>
  <div class="flex justify-center items-center py-6">
    <button
      type="button"
      class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      v-if="resource?.pageInfo.hasNextPage"
      @click="showMore(resource.pageInfo.endCursor)"
    >
      Load more
    </button>

    <span v-else> You've reached the end! </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Pagination',
  props: {
    resource: Object,
  },
  methods: {
    showMore(endCursor: string) {
      this.$emit('showMore', endCursor)
    },
  },
})
</script>
