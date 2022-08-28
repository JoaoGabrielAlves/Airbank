<template>
  <div>
    <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
      <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
        <dt class="text-sm font-medium text-gray-500 truncate">
          Total Transactions
        </dt>
        <dd class="mt-1 text-3xl tracking-tight font-semibold text-gray-900">
          {{ transactionsCount?._all }}
        </dd>
      </div>

      <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
        <dt class="text-sm font-medium text-gray-500 truncate">
          Total Categories
        </dt>
        <dd class="mt-1 text-3xl tracking-tight font-semibold text-gray-900">
          {{ categoriesCount?._all }}
        </dd>
      </div>

      <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
        <dt class="text-sm font-medium text-gray-500 truncate">
          Total accounts
        </dt>
        <dd class="mt-1 text-3xl tracking-tight font-semibold text-gray-900">
          {{ accountsCount?._all }}
        </dd>
      </div>
    </dl>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { accountsCount } from '~/graphql/accounts/queries/accountsCount'
import { categoriesCount } from '~/graphql/categories/queries/categoriesCount'
import { transactionsCount } from '~/graphql/transactions/queries/transactionsCount'

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
  apollo: {
    accountsCount: accountsCount,
    categoriesCount: categoriesCount,
    transactionsCount: transactionsCount,
  },
})
</script>
