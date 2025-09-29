<template>
  <div class="flex justify-center">
    <div class="tabs tabs-boxed">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="{ 'tab-active': modelValue === tab.key }"
        class="tab"
        @click="$emit('update:modelValue', tab.key)"
      >
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true
  },
  tabs: {
    type: Array,
    required: true,
    validator: (tabs) => {
      return tabs.every(tab =>
        tab &&
        typeof tab.key === 'string' &&
        typeof tab.label === 'string'
      )
    }
  }
})

defineEmits(['update:modelValue'])
</script>