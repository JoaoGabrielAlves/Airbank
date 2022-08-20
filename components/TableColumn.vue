<template>
  <td
    :class="isFirst ? 'pl-4 pr-3 sm:pl-6' : 'px-3'"
    class="whitespace-nowrap py-4 text-sm text-gray-900"
  >
    <slot></slot>
  </td>
</template>

<script lang="ts">
export default {
  name: 'TableColumn',
  props: {
    isFirst: {
      default: false,
      type: Boolean,
    },
  },
}
</script>
