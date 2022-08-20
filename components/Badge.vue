<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium text-gray-900"
    v-bind:style="{ 'background-color': '#' + color }"
  >
    <slot></slot>
  </span>
</template>

<script lang="ts">
export default {
  name: 'Badge',
  props: {
    color: String,
  },
}
</script>
