<template>
  <div :class="cardClasses">
    <div class="card-body">
      <!-- 折扣标签或类型标识 -->
      <div v-if="item.discount" class="badge badge-primary absolute top-2 right-2">
        立省{{ item.discount }}%
      </div>

      <!-- 头像和标题 -->
      <div class="flex items-center gap-2 sm:gap-3 mb-4">
        <div class="avatar">
          <div :class="avatarClasses">
            <div class="flex items-center justify-center h-full">
              <span :class="iconClasses">{{ displayIcon }}</span>
            </div>
          </div>
        </div>
        <div class="min-w-0 flex-1">
          <h3 class="card-title text-sm sm:text-base truncate">{{ item.title }}</h3>
          <p class="text-xs sm:text-sm opacity-70 line-clamp-2">{{ item.subtitle }}</p>
        </div>
      </div>

      <!-- 价格信息 -->
      <div class="mb-3 sm:mb-4">
        <div class="flex items-baseline gap-1">
          <span class="text-xl sm:text-2xl font-bold">${{ item.price }}</span>
          <span v-if="item.period" class="text-xs sm:text-sm opacity-60">/{{ item.period }}</span>
        </div>
        <p class="text-xs opacity-50 mt-1 line-clamp-2">{{ item.priceNote }}</p>
      </div>

      <!-- 操作按钮 -->
      <div class="card-actions justify-end mb-3 sm:mb-4">
        <button
          :class="buttonClasses"
          @click="$emit('action', item, actionType)"
        >
          {{ actionText }}
        </button>
      </div>

      <!-- 特权/特点说明 -->
      <div class="space-y-2 sm:space-y-3">
        <!-- 订阅专有：代币信息和进度条 -->
        <template v-if="isSubscription">
          <div class="flex items-center gap-2">
            <div class="badge badge-secondary badge-sm">💎</div>
            <span class="text-xs sm:text-sm truncate">每月可获得{{ item.tokens }}猫罐头</span>
          </div>
          <progress
            class="progress progress-primary h-1 sm:h-2"
            :value="item.progress"
            max="100"
          />
          <p class="text-xs opacity-60 line-clamp-2">{{ item.progressText }}</p>
        </template>

        <!-- 特权/特点列表 -->
        <div class="space-y-1 sm:space-y-2" :class="{ 'mt-3 sm:mt-4': isSubscription }">
          <div
            v-for="feature in item.features"
            :key="feature"
            class="flex items-start gap-2"
          >
            <div :class="featureBadgeClasses">{{ featureIcon }}</div>
            <span class="text-xs sm:text-sm leading-tight">{{ feature }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ['subscription', 'purchase'].includes(value)
  }
})

defineEmits(['action'])

// 计算属性
const isSubscription = computed(() => props.type === 'subscription')

const cardClasses = computed(() => [
  'card w-60 sm:w-72 bg-base-100 shadow-xl border',
  isSubscription.value ? 'border-primary/20' : 'border-success/20'
])

const avatarClasses = computed(() => [
  'w-10 sm:w-12 rounded-full',
  isSubscription.value ? 'bg-primary' : 'bg-success'
])

const iconClasses = computed(() => [
  'text-lg sm:text-xl',
  isSubscription.value ? 'text-primary-content' : 'text-success-content'
])

const buttonClasses = computed(() => [
  'btn btn-block btn-sm sm:btn-md',
  isSubscription.value ? 'btn-primary' : 'btn-success'
])

const featureBadgeClasses = computed(() => [
  'badge badge-sm flex-shrink-0 mt-0.5 sm:mt-0',
  isSubscription.value ? 'badge-success' : 'badge-info'
])

const displayIcon = computed(() => {
  return isSubscription.value ? '🤖' : props.item.icon
})

const actionType = computed(() => {
  return isSubscription.value ? 'subscribe' : 'purchase'
})

const actionText = computed(() => {
  return isSubscription.value ? '投喂' : '立即购买'
})

const featureIcon = computed(() => {
  return isSubscription.value ? '✓' : '★'
})
</script>