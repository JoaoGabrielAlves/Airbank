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
    <Pagination :resource="paginatedCategories" @showMore="showMore" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import gql from 'graphql-tag'
import { PaginatedResponse } from '../../static/graphqlTypes'

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
    }
  },
  apollo: {
    paginatedCategories: {
      query: gql`
        query (
          $take: Int
          $linksAfter: String
          $sortField: String
          $sortDirection: String
        ) {
          paginatedCategories(
            take: $take
            after: $linksAfter
            sortField: $sortField
            sortDirection: $sortDirection
          ) {
            pageInfo {
              endCursor
              hasNextPage
            }
            edges {
              cursor
              node {
                id
                name
                color
              }
            }
          }
        }
      `,
      variables: {
        take: 10,
      },
    },
  },
  methods: {
    showMore(endCursor: string) {
      this.$apollo.queries.paginatedCategories.fetchMore({
        variables: {
          linksAfter: endCursor,
          previousEndCursor: endCursor,
          sortField: this.sortField,
          sortDirection: this.sortDirection,
        },

        updateQuery: (
          previousResult: PaginatedResponse,
          { fetchMoreResult }: { fetchMoreResult: PaginatedResponse }
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
      this.$apollo.queries.paginatedCategories.fetchMore({
        variables: {
          take: 10,
          linksAfter: '',
          sortField: this.sortField,
          sortDirection: this.sortDirection,
        },

        updateQuery: (
          previousResult: PaginatedResponse,
          { fetchMoreResult }: { fetchMoreResult: PaginatedResponse }
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
