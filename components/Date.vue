<template>
  <span>
    {{ formatDate(new Date(parseInt(date))) }}
  </span>
</template>

<script lang="ts">
export default {
  name: 'Date',
  props: {
    date: String,
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
}
</script>
