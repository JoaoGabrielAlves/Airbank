<template>
  <Details
    title="Transaction information"
    description="Transaction details category and account."
  >
    <DetailsSection title="Reference">
      <span v-if="transactionById?.reference">
        {{ transactionById?.reference }}
      </span>

      <span v-else class="text-sm text-gray-500"> No reference provided </span>
    </DetailsSection>
    <DetailsSection title="Date">
      {{ formatDate(new Date(transactionById?.date)) }}
    </DetailsSection>
    <DetailsSection title="Amount">
      <Amount
        :amount="transactionById?.amount"
        :currency="transactionById?.currency"
      />
    </DetailsSection>
    <DetailsSection title="Category">
      <Badge :color="transactionById?.Category?.color">
        {{
          transactionById?.Category?.name
            ? transactionById?.Category?.name
            : transactionById?.Category?.color
        }}
      </Badge>
    </DetailsSection>
    <DetailsSection title="Account">
      {{ transactionById?.Account.name }}
    </DetailsSection>
    <DetailsSection title="Bank">
      {{ transactionById?.Account.bank }}
    </DetailsSection>
  </Details>
</template>

<script lang="ts">
import Vue from 'vue'
import gql from 'graphql-tag'
import DetailsSection from '~/components/DetailsSection.vue'

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
  components: { DetailsSection },
})
</script>
