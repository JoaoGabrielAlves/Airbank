<template>
  <span>
    {{
      new Date(parseInt(date)).toLocaleString('pt-BR', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'UTC',
      })
    }}
  </span>
</template>

<script lang="ts">
export default {
  name: 'Date',
  props: {
    date: String,
  },
}
</script>
