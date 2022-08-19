<template>
  <td
    :class="isFirst ? 'pl-4 pr-3 sm:pl-6' : 'px-3'"
    class="whitespace-nowrap text-sm text-gray-900"
  >
    {{ title }}
  </td>
</template>

<script lang="ts">
export default {
  name: 'TableColumn',
  props: {
    title: String,
    isFirst: Boolean,
  },
}
</script>
