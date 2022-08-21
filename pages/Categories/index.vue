<template>
  <div>
    <Table title="Categories" description="List of categories" name="category">
      <template slot="header">
        <TableHead title="Name" :isFirst="false" />
        <TableHead title="Color" />
      </template>
      <template slot="body">
        <tr
          class="cursor-pointer hover:bg-gray-50"
          v-for="category in paginatedCategories?.edges"
          :key="category.id"
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
import Badge from '~/components/Badge.vue'

export default Vue.extend({
  apollo: {
    paginatedCategories: {
      query: gql`
        query ($linksFirst: Int, $linksAfter: String) {
          paginatedCategories(first: $linksFirst, after: $linksAfter) {
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
        linksFirst: 10,
      },
    },
  },
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
  methods: {
    showMore(endCursor: string) {
      this.$apollo.queries.paginatedCategories.fetchMore({
        variables: {
          linksAfter: endCursor,
          previousEndCursor: endCursor,
        },

        updateQuery: (previousResult, { fetchMoreResult }) => {
          fetchMoreResult.paginatedCategories.edges = [
            ...previousResult.paginatedCategories.edges,
            ...fetchMoreResult.paginatedCategories.edges,
          ]

          return fetchMoreResult
        },
      })
    },
  },
  components: { Badge },
})
</script>
