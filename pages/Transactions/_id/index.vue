<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900">
        Transaction information
      </h3>
      <p class="mt-1 max-w-2xl text-sm text-gray-500">
        Details category and account.
      </p>
    </div>
    <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
      <dl class="sm:divide-y sm:divide-gray-200">
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Reference</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            <span v-if="transactionById?.reference">
              {{ transactionById?.reference }}
            </span>

            <span v-else class="text-sm text-gray-500">
              No reference provided
            </span>
          </dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Date</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{ formatDate(new Date(transactionById?.date)) }}
          </dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Amount</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            <span>
              {{
                (Math.round(transactionById?.amount * 100) / 100)
                  .toFixed(2)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }}
            </span>
            <span class="text-xs text-gray-400">
              {{ transactionById?.currency }}
            </span>
          </dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Category</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            <Badge :color="transactionById?.Category?.color" text="">
              {{
                transactionById?.Category?.name
                  ? transactionById?.Category?.name
                  : transactionById?.Category?.color
              }}
            </Badge>
          </dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Account</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{ transactionById?.Account.name }}
          </dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Bank</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{ transactionById?.Account.bank }}
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import gql from 'graphql-tag'

export default Vue.extend({
  data() {
    return {
      transactionId: this.$route.params.id,
    }
  },
  head() {
    return {
      title: 'View transaction',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'View a single transaction by id',
        },
      ],
    }
  },
  methods: {
    formatDate(date: Date) {
      return [
        this.padTo2Digits(date.getDate()),
        this.padTo2Digits(date.getMonth() + 1),
        date.getFullYear().toString().slice(-2),
      ].join('/')
    },
    padTo2Digits(num: number) {
      return num.toString().padStart(2, '0')
    },
  },
  apollo: {
    transactionById: {
      query: gql`
        query ($transactionId: String!) {
          transactionById(id: $transactionId) {
            reference
            date
            amount
            currency
            Category {
              name
              color
            }
            Account {
              name
              bank
            }
          }
        }
      `,
      variables() {
        let transactionId = this.transactionId

        return {
          transactionId: transactionId,
        }
      },
    },
  },
})
</script>
