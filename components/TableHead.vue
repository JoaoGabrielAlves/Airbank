<template>
  <td
    :class="isFirst ? 'py-3.5 pl-4 pr-3 sm:pl-6' : 'px-3 py-3.5'"
    class="text-left text-sm font-semibold text-gray-900"
  >
    {{ title }}
  </td>
</template>

<script lang="ts">
export default {
  name: 'TableHead',
  props: ['title', 'isFirst'],
}
</script>
