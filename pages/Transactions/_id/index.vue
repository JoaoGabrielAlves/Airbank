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
      <Date :date="transactionById?.date" />
    </DetailsSection>
    <DetailsSection title="Amount">
      <Amount
        :amount="transactionById?.amount"
        :currency="transactionById?.currency"
      />
    </DetailsSection>
    <DetailsSection title="Category">
      <div class="flex justify-between">
        <Badge v-if="!update" :color="transactionById?.Category?.color">
          {{
            transactionById?.Category?.name
              ? transactionById?.Category?.name
              : transactionById?.Category?.color
          }}
        </Badge>
        <AutoComplete
          v-else
          :label="false"
          name="Category"
          :options="autocompleteCategory"
          optionValueKey="name"
          optionIdentifierKey="name"
          hasMutation
          @update="categorySearch = $event"
          @selected="selectedCategoryName = $event"
        />
        <button
          class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md"
          :class="
            update
              ? 'bg-red-100 hover:bg-red-200 text-red-700'
              : 'bg-green-100 hover:bg-green-200 text-green-700'
          "
          @click="update = !update"
        >
          {{ update ? 'Cancel' : 'Update' }}
        </button>
      </div>
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

export default Vue.extend({
  data() {
    return {
      transactionId: this.$route.params.id,
      categorySearch: '',
      selectedCategoryName: '',
      update: false,
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
  watch: {
    selectedCategoryName() {
      this.updateTransactionCategory()
    },
    categorySearch() {
      this.reloadAutocompleteCategory()
    },
  },
  methods: {
    reloadAutocompleteCategory() {
      this.$apollo.queries.autocompleteCategory.fetchMore({
        variables: {
          search: this.categorySearch,
        },

        // @ts-ignore
        updateQuery: (previousResult, { fetchMoreResult }) => {
          return fetchMoreResult
        },
      })
    },
    reloadTransaction() {
      this.$apollo.queries.transactionById.fetchMore({
        variables: {
          search: this.categorySearch,
        },

        // @ts-ignore
        updateQuery: (previousResult, { fetchMoreResult }) => {
          return fetchMoreResult
        },
      })
    },
    updateTransactionCategory() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation ($transactionId: String!, $categoryName: String!) {
              updateTransactionCategory(
                transactionId: $transactionId
                categoryName: $categoryName
              ) {
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
          variables: {
            transactionId: this.transactionId,
            categoryName: this.selectedCategoryName,
          },
        })
        .then(() => {
          this.$apollo.queries.transactionById.refetch()
        })
        .finally(() => {
          this.update = false
        })
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
    autocompleteCategory: {
      query: gql`
        query ($search: String) {
          autocompleteCategory(search: $search) {
            id
            name
          }
        }
      `,
      variables: {
        search: '',
      },
    },
  },
})
</script>
