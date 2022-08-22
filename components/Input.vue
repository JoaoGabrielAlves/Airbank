<template>
  <div>
    <label
      v-if="label"
      for="search"
      class="block text-sm font-medium text-gray-700"
      >{{ label }}
    </label>
    <div class="relative rounded-md shadow-sm" :class="label ? 'mt-1' : ''">
      <template v-if="leadingIcon">
        <span class="h-full absolute inset-y-0 left-0 flex items-center pl-2">
          <slot></slot>
        </span>
      </template>
      <input
        :disabled="disabled"
        v-model.lazy="value"
        :placeholder="placeholder"
        :name="name"
        :id="name"
        class="appearance-none rounded border border-gray-400 border-b block py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
        :class="{
          'pl-4': trailingIcon | !leadingIcon,
          'pr-10': trailingIcon,
          'pl-8': leadingIcon,
          'pr-6': leadingIcon | !trailingIcon,
        }"
      />
      <div
        v-if="trailingIcon"
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      value: '',
    }
  },
  name: 'Input',
  props: {
    label: String,
    trailingIcon: Boolean,
    leadingIcon: Boolean,
    disabled: Boolean,
    name: String,
    placeholder: String,
  },
  watch: {
    value() {
      this.$emit('change', this.value)
    },
  },
})
</script>
