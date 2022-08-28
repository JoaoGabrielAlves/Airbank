<template>
  <div>
    <Table
      title="Categories"
      description="List of categories including their name and color"
      :hasData="paginatedCategories?.edges.length > 0"
      :isLoading="$apollo.queries.paginatedCategories.loading"
    >
      <template slot="header">
        <TableHead
          hasSort
          :sortField="sortField"
          :sortDirection="sortDirection"
          field="name"
          title="Name"
          @click="updateSortFieldAndDirection"
          :loading="$apollo.queries.paginatedCategories.loading"
          :isFirst="true"
        />
        <TableHead title="Color" />
      </template>
      <template slot="body">
        <tr
          class="cursor-pointer hover:bg-gray-50"
          v-for="category in paginatedCategories?.edges"
          :key="category.node.id"
          @click="view(category.node.id)"
        >
          <TableColumn :isFirst="true">
            {{ category.node.name }}
          </TableColumn>
          <TableColumn>
            <Badge v-if="category.node.color" :color="category.node.color">
              {{ category.node.color }}
            </Badge>
          </TableColumn>
        </tr>
      </template>
    </Table>
    <Pagination :resource="paginatedCategories" @showMore="nextPage" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { CategoryEdge } from '~/static/types/generated'

import { paginatedCategories } from '~/graphql/categories/queries/paginatedCategories'

export default Vue.extend({
  head() {
    return {
      title: 'Categories',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'List of transaction categories',
        },
      ],
    }
  },
  data() {
    return {
      sortField: '',
      sortDirection: '',
      page: 1,
    }
  },
  apollo: {
    paginatedCategories: {
      query: paginatedCategories,
      variables: {
        take: 10,
        page: 1,
      },
    },
  },
  methods: {
    nextPage() {
      this.page += 1
      this.showMore()
    },
    showMore() {
      this.$apollo.queries.paginatedCategories.fetchMore({
        variables: {
          page: this.page,
          sortField: this.sortField,
          sortDirection: this.sortDirection,
        },

        updateQuery: (
          previousResult: {
            paginatedCategories: {
              edges: Array<CategoryEdge>
            }
          },
          {
            fetchMoreResult,
          }: {
            fetchMoreResult: {
              paginatedCategories: {
                edges: Array<CategoryEdge>
              }
            }
          }
        ) => {
          fetchMoreResult.paginatedCategories.edges = [
            ...previousResult.paginatedCategories.edges,
            ...fetchMoreResult.paginatedCategories.edges,
          ]

          return fetchMoreResult
        },
      })
    },
    applyFilters() {
      this.page = 1

      this.$apollo.queries.paginatedCategories.fetchMore({
        variables: {
          take: 10,
          page: 1,
          sortField: this.sortField,
          sortDirection: this.sortDirection,
        },

        updateQuery: (
          _previousResult: {
            paginatedCategories: {
              edges: Array<CategoryEdge>
            }
          },
          {
            fetchMoreResult,
          }: {
            fetchMoreResult: {
              paginatedCategories: {
                edges: Array<CategoryEdge>
              }
            }
          }
        ) => {
          return fetchMoreResult
        },
      })
    },
    view(id: string) {
      this.$router.push(`/categories/${id}`)
    },
    updateSortFieldAndDirection(direction: 'asc' | 'desc', field: 'name') {
      this.sortDirection = direction
      this.sortField = field

      this.applyFilters()
    },
  },
})
</script>
