<template>
  <Table title="Categories" description="List of categories" name="category">
    <template slot="header">
      <TableHead title="Name" :isFirst="false" />
      <TableHead title="Color" />
    </template>
    <template slot="body">
      <tr
        class="cursor-pointer hover:bg-gray-50"
        v-for="category in allCategories"
        :key="category.id"
      >
        <TableColumn :isFirst="true">
          {{ category.name }}
        </TableColumn>
        <TableColumn>
          <Badge v-if="category.color" :color="category.color">
            {{ category.color }}
          </Badge>
        </TableColumn>
      </tr>
    </template>
  </Table>
</template>

<script lang="ts">
import gql from 'graphql-tag'
import Badge from '~/components/Badge.vue'

export default {
  apollo: {
    allCategories: gql`
      query {
        allCategories {
          id
          name
          color
        }
      }
    `,
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
  components: { Badge },
}
</script>
