<template>
  <div :class="containerClass">
    <span>
      {{ formatAmount(amount) }}
    </span>
    <span class="text-xs text-gray-400">
      {{ currency }}
    </span>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Amount',
  props: {
    amount: Number,
    currency: String,
    containerClass: String,
  },
  methods: {
    formatAmount(amount: number) {
      return (Math.round(amount * 100) / 100)
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
  },
}
</script>
