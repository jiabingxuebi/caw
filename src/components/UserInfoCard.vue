<template>
  <div class="card bg-base-300 max-w-md lg:max-w-lg mx-auto">
    <div class="card-body">
      <!-- 用户基本信息 -->
      <div class="flex items-center gap-4 mb-6">
        <div class="avatar">
          <div class="w-16 rounded-full border-2 border-base-100">
            <img :src="user.avatar" :alt="`${user.username}的头像`" class="object-cover" />
          </div>
        </div>
        <div class="flex-1">
          <h2 class="text-xl font-bold">{{ user.username }}</h2>
          <p class="text-sm opacity-60">ID: {{ user.userId }}</p>
        </div>
      </div>

      <!-- 余额信息 -->
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <div class="badge badge-warning">¥</div>
            <span class="text-sm opacity-80">我的余额</span>
          </div>
          <div class="text-3xl font-bold">{{ formatBalance(user.balance) }}</div>
        </div>

        <div class="card-actions">
          <button class="btn btn-ghost btn-sm" @click="handleViewDetails">
            查看明细
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  user: {
    type: Object,
    required: true,
    validator: (user) => {
      return user &&
        typeof user.avatar === 'string' &&
        typeof user.username === 'string' &&
        typeof user.userId === 'string' &&
        typeof user.balance === 'number'
    }
  }
})

defineEmits(['viewDetails'])

// 格式化余额显示
const formatBalance = (balance) => {
  return balance.toFixed(2)
}

// 处理查看明细
const handleViewDetails = () => {
  // 这里可以触发事件或跳转到明细页面
  console.log('查看余额明细')
}
</script>