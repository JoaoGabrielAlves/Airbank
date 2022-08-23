<template>
  <div>
    <label
      v-if="label"
      :for="name"
      class="block text-sm font-medium text-gray-700"
    >
      {{ name }}
    </label>
    <div class="relative" :class="label ? 'mt-1' : ''">
      <input
        :disabled="disabled"
        :name="name"
        :id="name"
        v-model="search"
        type="text"
        class="appearance-none rounded border border-gray-400 border-b block pl-3 pr-12 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
        role="combobox"
        aria-controls="options"
        aria-expanded="false"
        @keydown="onKeydown"
      />
      <button
        type="button"
        class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
        @click="toggleShowList()"
      >
        <svg
          class="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <ul
        v-if="options?.length > 0 && showList && search"
        class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        id="options"
        role="listbox"
      >
        <li
          @mouseover="arrowCounter = index"
          @mouseleave="arrowCounter = ''"
          @click="handleSelected()"
          v-for="(option, index) in options"
          :key="option[optionIdentifierKey]"
          class="relative cursor-default select-none py-2 pl-3 pr-9"
          :class="
            arrowCounter === index
              ? 'text-white bg-indigo-600'
              : ' text-gray-900'
          "
          id="option-0"
          role="option"
          tabindex="-1"
        >
          <span
            class="block truncate"
            :class="
              selectedOption === option[optionIdentifierKey]
                ? 'font-semibold'
                : ''
            "
          >
            {{ option[optionValueKey] }}
          </span>

          <span
            v-if="selectedOption === option[optionIdentifierKey]"
            class="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600"
          >
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
        </li>
        <div v-if="!options?.length > 0">
          <li
            class="relative cursor-default select-none py-2 pl-3 pr-9"
            id="option-0"
            role="option"
            tabindex="-1"
          >
            <span class="block truncate"> No options available </span>
          </li>
        </div>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      selectedOption: '',
      search: '',
      showList: true,
      arrowCounter: 0,
    }
  },
  name: 'AutoComplete',
  props: {
    label: {
      default: true,
      type: Boolean,
    },
    name: String,
    options: Array,
    optionIdentifierKey: String,
    optionValueKey: String,
    selectedValue: String,
    disabled: Boolean,
    hasMutation: Boolean,
  },
  created() {
    if (this.selectedValue) {
      this.selectedOption = this.selectedValue
      this.search = this.selectedValue

      this.showList = false
    }
  },
  watch: {
    search() {
      if (this.search != this.selectedValue) {
        this.$emit('change', this.search)

        if (!this.options?.length) {
          this.selectedOption = ''
          this.showList = true
        }

        if (!this.search) {
          this.$emit('selected', '')
        }
      }
    },
  },
  methods: {
    handleSelected() {
      const selected: any = this.options[this.arrowCounter]

      if (selected) {
        this.search = selected[this.optionValueKey]
        this.selectedOption = selected[this.optionValueKey]
        this.showList = false
        this.$emit('selected', selected[this.optionIdentifierKey])
      } else if (this.hasMutation && this.search) {
        this.$emit('selected', this.search)
      }
    },
    toggleShowList() {
      if (this.options?.length > 0) {
        this.showList = !this.showList
      }
    },
    onKeydown(evt: KeyboardEvent) {
      switch (evt.code) {
        case 'ArrowDown':
          evt.preventDefault()
          this.onArrowDown()
          break
        case 'ArrowUp':
          evt.preventDefault()
          this.onArrowUp()
          break
        case 'Enter':
          this.handleSelected()
          break
        case 'Escape':
          this.showList = false
          break
      }
    },
    onArrowDown() {
      if (this.arrowCounter < this.options?.length - 1) {
        this.arrowCounter += 1
      }
    },
    onArrowUp() {
      if (this.arrowCounter > 0) {
        this.arrowCounter -= 1
      }
    },
  },
})
</script>
