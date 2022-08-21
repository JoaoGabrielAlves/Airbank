<template>
  <div>
    <AppHeader />
    <div class="bg-gray-100 h-full min-h-screen w-screen min-w-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-12">
          <Nuxt />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import AppHeader from '../components/AppHeader.vue'

export default {
  components: {
    AppHeader,
  },
}
</script>
