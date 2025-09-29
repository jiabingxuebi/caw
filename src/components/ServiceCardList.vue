<template>
  <div class="relative flex justify-center">
    <div class="w-full max-w-5xl">
      <!-- 左右渐变遮罩 -->
      <div class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-base-100 to-transparent z-10 pointer-events-none" />
      <div class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-base-100 to-transparent z-10 pointer-events-none" />

      <!-- 滚动容器 -->
      <div class="overflow-x-auto scrollbar-hide">
        <div class="flex gap-3 sm:gap-4 px-3 sm:px-4 pb-2" style="width: max-content;">
          <ServiceCard
            v-for="item in items"
            :key="item.id"
            :item="item"
            :type="type"
            @action="handleAction"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ServiceCard from './ServiceCard.vue'

defineProps({
  items: {
    type: Array,
    required: true
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ['subscription', 'purchase'].includes(value)
  }
})

defineEmits(['action'])

const handleAction = (item, actionType) => {
  console.log(`${actionType} action for:`, item.title)
  // 这里可以处理购买/订阅逻辑
}
</script>