<template>
  <th
    scope="col"
    :class="isFirst ? 'py-3.5 pl-4 pr-3 sm:pl-6' : 'px-3 py-3.5'"
    class="text-left text-sm font-semibold text-gray-900"
  >
    {{ title }}
  </th>
</template>

<script lang="ts">
export default {
  name: 'TableHead',
  props: {
    title: String,
    isFirst: Boolean,
  },
}
</script>
