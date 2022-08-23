<template>
  <th
    scope="col"
    :class="isFirst ? 'py-3.5 pl-4 pr-3 sm:pl-6' : 'px-3 py-3.5'"
    class="text-left text-sm font-semibold text-gray-900"
  >
    <div v-if="hasSort" class="group inline-flex">
      {{ title }}
      <span
        class="text-gray-600 group-hover:text-gray-900 cursor-pointer"
        @click="updateSortFieldAndDirection()"
      >
        <template v-if="sortField == field">
          <svg
            v-if="sortDirection == 'desc'"
            class="h-5 w-5 ml-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 ml-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </template>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 ml-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      </span>
    </div>
    <template v-else>
      {{ title }}
    </template>
  </th>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'TableHead',
  props: {
    title: String,
    isFirst: {
      default: false,
      type: Boolean,
    },
    hasSort: Boolean,
    sortDirection: String,
    sortField: String,
    field: String,
  },
  methods: {
    updateSortFieldAndDirection() {
      const direction = this.sortDirection === 'asc' ? 'desc' : 'asc'

      this.$emit('click', direction, this.field)
    },
  },
})
</script>
