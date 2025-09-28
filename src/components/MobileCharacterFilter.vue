<template>
  <div class="lg:hidden flex flex-col mb-6 gap-4">
    <!-- 搜索框 -->
    <div class="relative w-full">
      <div class="absolute top-1/2 left-3 transform -translate-y-1/2 pointer-events-none z-10">
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        placeholder="搜索角色..."
        class="input w-full pl-10 focus:outline-none"
        :value="searchQuery"
        @input="$emit('update:searchQuery', $event.target.value)"
        @keyup.enter="$emit('search')"
      />
    </div>

    <!-- 过滤器、排序和无限制开关 -->
    <div class="flex items-center justify-between">
      <!-- 左侧：标签过滤器+排序 -->
      <div class="flex items-center gap-2">
        <!-- 标签过滤器 -->
        <div
          @click="$emit('open-filter')"
          class="relative bg-base-100 border border-base-300 rounded-lg px-3 py-2 cursor-pointer hover:bg-base-200 transition-colors"
        >
          <svg class="w-4 h-4 text-base-content" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 4h2v2H3V4zm4 0h14v2H7V4zM3 10h2v2H3v-2zm4 0h14v2H7v-2zM3 16h2v2H3v-2zm4 0h14v2H7v-2z" />
          </svg>
          <div
            v-if="selectedTags.length > 0"
            class="absolute -top-1 -right-1 bg-base-content text-base-100 text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none"
          >
            {{ selectedTags.length }}
          </div>
        </div>

        <!-- 排序功能 -->
        <div class="relative">
          <div
            @click="$emit('toggle-sort')"
            class="flex items-center bg-base-100 border border-base-300 rounded-lg px-3 py-2 cursor-pointer hover:bg-base-200 transition-colors min-w-[110px]"
          >
            <div class="flex items-center justify-between w-full gap-2">
              <span class="text-sm font-medium text-base-content">{{ currentSort }}</span>
              <svg
                class="w-4 h-4 text-base-content transition-transform duration-200 flex-shrink-0"
                :class="{ 'rotate-180': sortDropdownOpen }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <!-- 下拉菜单 -->
          <div
            v-show="sortDropdownOpen"
            class="absolute top-full mt-1 right-0 bg-base-100 border border-base-300 rounded-lg shadow-lg py-1 w-full z-20"
          >
            <div
              v-for="option in sortOptions"
              :key="option"
              @click="$emit('select-sort', option)"
              class="px-3 py-2 text-sm text-base-content hover:bg-base-200 cursor-pointer transition-colors"
              :class="{ 'bg-base-200 font-medium': option === currentSort }"
            >
              {{ option }}
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：无限制开关 -->
      <div class="flex items-center gap-2">
        <span class="text-sm text-base-content font-medium">无限制</span>
        <input
          type="checkbox"
          class="toggle toggle-primary toggle-sm"
          :checked="unlimitedMode"
          @change="$emit('update:unlimitedMode', $event.target.checked)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
// Props
defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
  selectedTags: {
    type: Array,
    default: () => [],
  },
  currentSort: {
    type: String,
    default: 'Trending',
  },
  sortOptions: {
    type: Array,
    default: () => [],
  },
  sortDropdownOpen: {
    type: Boolean,
    default: false,
  },
  unlimitedMode: {
    type: Boolean,
    default: false,
  },
})

// Emits
defineEmits(['update:searchQuery', 'update:unlimitedMode', 'search', 'open-filter', 'toggle-sort', 'select-sort'])
</script>
