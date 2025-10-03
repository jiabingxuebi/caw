<template>
  <div class="base-tag-input-wrapper" :class="{ 'base-tag-input-disabled': disabled }">
    <!-- 标签列表 -->
    <div v-if="tags.length > 0" class="tags-container" :class="tagsContainerClass">
      <span
        v-for="(tag, index) in tags"
        :key="index"
        class="tag"
        :class="tagClass"
      >
        <span class="tag-text">{{ tag }}</span>
        <button
          v-if="!disabled"
          type="button"
          @click="removeTag(index)"
          class="tag-remove"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </span>
    </div>

    <!-- 输入框 -->
    <input
      ref="inputRef"
      v-model="inputValue"
      type="text"
      :placeholder="tags.length === 0 ? placeholder : ''"
      :disabled="disabled"
      @keydown.enter.prevent="addTag"
      @keydown.delete="handleBackspace"
      class="tag-input"
      :class="inputClass"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },

  size: {
    type: String,
    default: 'md',
    validator: value => ['sm', 'md', 'lg'].includes(value),
  },

  placeholder: {
    type: String,
    default: '输入后按回车添加',
  },

  disabled: {
    type: Boolean,
    default: false,
  },

  maxTags: {
    type: Number,
    default: null,
  },

  allowDuplicates: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'add', 'remove'])

const inputValue = ref('')
const inputRef = ref(null)

const tags = computed(() => props.modelValue || [])

const addTag = () => {
  const value = inputValue.value.trim()

  if (!value) return

  if (props.maxTags && tags.value.length >= props.maxTags) {
    return
  }

  if (!props.allowDuplicates && tags.value.includes(value)) {
    inputValue.value = ''
    return
  }

  const newTags = [...tags.value, value]
  emit('update:modelValue', newTags)
  emit('add', value)

  inputValue.value = ''
}

const removeTag = index => {
  const removedTag = tags.value[index]
  const newTags = tags.value.filter((_, i) => i !== index)
  emit('update:modelValue', newTags)
  emit('remove', removedTag)
}

const handleBackspace = () => {
  if (inputValue.value === '' && tags.value.length > 0) {
    removeTag(tags.value.length - 1)
  }
}

const tagsContainerClass = computed(() => {
  const classes = []

  switch (props.size) {
    case 'sm':
      classes.push('gap-1', 'mb-1')
      break
    case 'lg':
      classes.push('gap-2', 'mb-3')
      break
    default:
      classes.push('gap-2', 'mb-2')
  }

  return classes.join(' ')
})

const tagClass = computed(() => {
  const classes = []

  switch (props.size) {
    case 'sm':
      classes.push('tag-sm')
      break
    case 'lg':
      classes.push('tag-lg')
      break
    default:
      classes.push('tag-md')
  }

  return classes.join(' ')
})

const inputClass = computed(() => {
  const classes = []

  switch (props.size) {
    case 'sm':
      classes.push('tag-input-sm')
      break
    case 'lg':
      classes.push('tag-input-lg')
      break
    default:
      classes.push('tag-input-md')
  }

  return classes.join(' ')
})
</script>

<style scoped>
.base-tag-input-wrapper {
  position: relative;
  width: 100%;
  min-height: 2.5rem;
  padding: 0.375rem 0.75rem;
  background-color: hsl(var(--b1));
  border: 1px solid hsl(var(--bc) / 0.2);
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
}

.base-tag-input-wrapper:focus-within {
  border-color: hsl(var(--p));
  box-shadow: 0 0 0 3px hsl(var(--p) / 0.1);
}

.base-tag-input-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: hsl(var(--b2));
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background-color: hsl(var(--p) / 0.1);
  color: hsl(var(--p));
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
}

.tag:hover {
  background-color: hsl(var(--p) / 0.2);
}

.tag-sm {
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  line-height: 1.25rem;
}

.tag-md {
  padding: 0.25rem 0.625rem;
  font-size: 0.875rem;
  line-height: 1.5rem;
}

.tag-lg {
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.75rem;
}

.tag-text {
  user-select: none;
}

.tag-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: none;
  border: none;
  color: hsl(var(--p));
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s ease-in-out;
}

.tag-remove:hover {
  opacity: 1;
}

.tag-input {
  flex: 1;
  min-width: 120px;
  border: none;
  outline: none;
  background: transparent;
  color: hsl(var(--bc));
  font-size: inherit;
}

.tag-input::placeholder {
  color: hsl(var(--bc) / 0.5);
}

.tag-input:disabled {
  cursor: not-allowed;
}

.tag-input-sm {
  height: 1.5rem;
  font-size: 0.75rem;
}

.tag-input-md {
  height: 1.75rem;
  font-size: 0.875rem;
}

.tag-input-lg {
  height: 2rem;
  font-size: 1rem;
}
</style>
