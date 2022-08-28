<template>
  <Details title="Category information" description="Category name and color">
    <DetailsSection title="Name">
      {{ categoryById?.name }}
    </DetailsSection>
    <DetailsSection title="Color">
      <Badge v-if="categoryById?.color" :color="categoryById?.color">
        {{ categoryById?.color }}
      </Badge>
      <span v-else class="text-sm text-gray-500">
        This category has no color
      </span>
    </DetailsSection>
  </Details>
</template>

<script lang="ts">
import Vue from 'vue'

import { categoryById } from '~/graphql/categories/queries/categoryById'

export default Vue.extend({
  data() {
    return {
      categoryId: this.$route.params.id,
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
    categoryById: {
      query: categoryById,
      variables() {
        let categoryId = this.categoryId
        return {
          categoryId: categoryId,
        }
      },
    },
  },
})
</script>
