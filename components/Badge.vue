<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium text-black"
    v-bind:style="{ 'background-color': '#' + color }"
  >
    {{ color }}
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
