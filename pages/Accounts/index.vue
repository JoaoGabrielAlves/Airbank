<template>
  <div>
    <Table title="Accounts" description="List of accounts" name="account">
      <template slot="header">
        <TableHead title="Name" :isFirst="true" />
        <TableHead title="Bank" />
      </template>
      <template slot="body">
        <tr
          class="cursor-pointer hover:bg-gray-50"
          v-for="account in allAccounts"
          :key="account.id"
        >
          <TableColumn :content="account.name" :isFirst="true" />
          <TableColumn :content="account.bank" />
        </tr>
      </template>
    </Table>
  </div>
</template>

<script lang="ts">
import gql from 'graphql-tag'
import TableColumn from '~/components/TableColumn.vue'
import TableHead from '~/components/TableHead.vue'

export default {
  apollo: {
    allAccounts: gql`
      query {
        allAccounts {
          id
          name
          bank
        }
      }
    `,
  },
  components: { TableColumn, TableHead },
}
</script>
