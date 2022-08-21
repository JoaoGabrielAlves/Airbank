<template>
  <div>
    <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
      <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
        <dt class="text-sm font-medium text-gray-500 truncate">
          Total Transactions
        </dt>
        <dd class="mt-1 text-3xl tracking-tight font-semibold text-gray-900">
          42003951
        </dd>
      </div>

      <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
        <dt class="text-sm font-medium text-gray-500 truncate">
          Total Categories
        </dt>
        <dd class="mt-1 text-3xl tracking-tight font-semibold text-gray-900">
          25
        </dd>
      </div>

      <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
        <dt class="text-sm font-medium text-gray-500 truncate">
          Total accounts
        </dt>
        <dd class="mt-1 text-3xl tracking-tight font-semibold text-gray-900">
          25
        </dd>
      </div>
    </dl>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import gql from 'graphql-tag'

export default Vue.extend({
  head() {
    return {
      title: 'Dashboard',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Airbank dashboard',
        },
      ],
    }
  },
})
</script>
