<template>
  <Details title="Category information" description="Category name and color">
    <DetailsSection title="Name">
      {{ accountById?.name }}
    </DetailsSection>
    <DetailsSection title="Bank">
      {{ accountById?.bank }}
    </DetailsSection>
  </Details>
</template>

<script lang="ts">
import Vue from 'vue'
import gql from 'graphql-tag'

export default Vue.extend({
  data() {
    return {
      accountId: this.$route.params.id,
    }
  },
  head() {
    return {
      title: 'View category',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'View a single category by id',
        },
      ],
    }
  },
  apollo: {
    accountById: {
      query: gql`
        query ($accountId: String!) {
          accountById(id: $accountId) {
            name
            bank
          }
        }
      `,
      variables() {
        let accountId = this.accountId
        return {
          accountId: accountId,
        }
      },
    },
  },
})
</script>
