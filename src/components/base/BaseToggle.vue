<template>
  <label class="base-toggle-wrapper" :class="wrapperClass">
    <input
      type="checkbox"
      class="peer sr-only"
      :checked="modelValue"
      @change="handleChange"
      :disabled="disabled"
      v-bind="$attrs"
    />
    <span
      class="toggle-track"
      :class="trackClass"
    ></span>
    <span
      class="toggle-thumb"
      :class="thumbClass"
    ></span>
  </label>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },

  size: {
    type: String,
    default: 'md',
    validator: value => ['sm', 'md', 'lg'].includes(value),
  },

  disabled: {
    type: Boolean,
    default: false,
  },

  color: {
    type: String,
    default: 'primary',
    validator: value => ['primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info'].includes(value),
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const handleChange = event => {
  const value = event.target.checked
  emit('update:modelValue', value)
  emit('change', value)
}

const wrapperClass = computed(() => {
  const classes = ['relative', 'inline-block', 'cursor-pointer']

  switch (props.size) {
    case 'sm':
      classes.push('w-9', 'h-5')
      break
    case 'lg':
      classes.push('w-14', 'h-7')
      break
    default:
      classes.push('w-11', 'h-6')
  }

  if (props.disabled) {
    classes.push('opacity-50', 'cursor-not-allowed')
  }

  return classes.join(' ')
})

const trackClass = computed(() => {
  const classes = [
    'absolute',
    'inset-0',
    'bg-base-300',
    'rounded-full',
    'transition-colors',
    'duration-200',
    'ease-in-out',
  ]

  // 根据颜色添加选中状态的背景色
  const colorMap = {
    primary: 'peer-checked:bg-primary',
    secondary: 'peer-checked:bg-secondary',
    accent: 'peer-checked:bg-accent',
    success: 'peer-checked:bg-success',
    warning: 'peer-checked:bg-warning',
    error: 'peer-checked:bg-error',
    info: 'peer-checked:bg-info',
  }

  classes.push(colorMap[props.color])

  if (props.disabled) {
    classes.push('peer-disabled:opacity-50', 'peer-disabled:pointer-events-none')
  }

  return classes.join(' ')
})

const thumbClass = computed(() => {
  const classes = [
    'absolute',
    'top-1/2',
    'start-0.5',
    '-translate-y-1/2',
    'bg-base-100',
    'rounded-full',
    'shadow-xs',
    'transition-transform',
    'duration-200',
    'ease-in-out',
    'peer-checked:translate-x-full',
  ]

  switch (props.size) {
    case 'sm':
      classes.push('size-4')
      break
    case 'lg':
      classes.push('size-6')
      break
    default:
      classes.push('size-5')
  }

  return classes.join(' ')
})
</script>

<style scoped>
.base-toggle-wrapper {
  user-select: none;
}

.toggle-track {
  display: block;
}

.toggle-thumb {
  display: block;
}
</style>
