<template>
  <div class="container mx-auto max-w-6xl p-4">
    <!-- 用户信息和邀请活动卡片区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- 用户个人信息卡片 -->
      <div class="card bg-base-300">
        <div class="card-body">
          <!-- 头部：头像、用户名、等级、操作按钮 -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
              <div class="avatar">
                <div class="w-16 rounded-full bg-primary">
                  <div class="flex items-center justify-center h-full">
                    <span class="text-primary-content text-2xl">🐱</span>
                  </div>
                </div>
              </div>
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <h2 class="text-xl font-bold">{{ userProfile.username }}</h2>
                  <div class="badge badge-neutral">Lv{{ userProfile.level }}</div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm opacity-60">ID:{{ userProfile.userId }}</span>
                  <button class="btn btn-ghost btn-xs" @click="copyUserId">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex gap-2">
              <button class="btn btn-ghost btn-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                设置
              </button>
              <button class="btn btn-ghost btn-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                编辑
              </button>
            </div>
          </div>

          <!-- 统计数据 -->
          <div class="grid grid-cols-3 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold">{{ userProfile.stats.followers }}</div>
              <div class="text-sm opacity-60">粉丝</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold">{{ userProfile.stats.interactions }}</div>
              <div class="text-sm opacity-60">互动</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold">{{ userProfile.stats.characters }}</div>
              <div class="text-sm opacity-60">角色</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 邀请活动卡片 -->
      <div class="card bg-base-300">
        <div class="card-body">
        <!-- 邀请活动标题 -->
        <div class="flex items-center gap-3 mb-4">
          <div class="avatar">
            <div class="w-12 rounded-full bg-secondary">
              <div class="flex items-center justify-center h-full">
                <span class="text-secondary-content text-lg">👥</span>
              </div>
            </div>
          </div>
          <div>
            <h3 class="card-title text-lg">邀请活动</h3>
            <div class="flex items-center gap-2">
              <div class="badge badge-accent">+50</div>
            </div>
          </div>
        </div>

        <!-- 活动描述 -->
        <p class="text-sm opacity-70 mb-4">
          邀请你的朋友来Mufy！大家都可以获得额外的50代币！
        </p>

        <!-- 邀请进度 -->
        <div class="flex items-center justify-center gap-2 mb-4">
          <div class="badge badge-outline">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            {{ inviteData.invited }}/{{ inviteData.total }}
          </div>
          <span class="text-sm opacity-60">已邀请</span>
        </div>

        <!-- 邀请码 -->
        <div class="card-actions justify-center">
          <div class="join">
            <input
              type="text"
              :value="inviteData.code"
              readonly
              class="input input-bordered join-item w-32 text-center font-mono"
            />
            <button
              class="btn btn-primary join-item"
              @click="copyInviteCode"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>

    <!-- 每日签到卡片 -->
    <div class="card bg-base-300 max-w-2xl mx-auto mt-6">
      <div class="card-body">
        <!-- 签到标题 -->
        <div class="text-center mb-4">
          <h3 class="card-title text-xl justify-center mb-2">已连续签到 {{ checkinData.consecutiveDays }} 天</h3>
          <p class="text-sm opacity-70">每天登录自动为您签到，记得每天都来领积分哦~</p>
        </div>

        <!-- 签到日历 -->
        <div class="grid grid-cols-7 gap-2 sm:gap-3">
          <div
            v-for="(day, index) in checkinData.days"
            :key="index"
            class="flex flex-col items-center"
          >
            <!-- 签到状态和奖励 -->
            <div
              :class="[
                'flex flex-col items-center justify-center w-16 h-20 sm:w-20 sm:h-24 rounded-2xl transition-all duration-200',
                day.status === 'completed' ? 'bg-primary text-primary-content' :
                day.status === 'current' ? 'bg-primary text-primary-content ring-2 ring-primary ring-offset-2' :
                'bg-base-200 text-base-content hover:bg-base-300'
              ]"
              @click="handleCheckin(day)"
            >
              <!-- 奖励积分 -->
              <div class="text-sm font-bold mb-1">+{{ day.reward }}</div>

              <!-- 状态图标 -->
              <div class="text-lg">
                <svg v-if="day.status === 'completed'" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span v-else-if="day.status === 'current'" class="text-2xl">🎁</span>
                <span v-else class="text-2xl">🎁</span>
              </div>
            </div>

            <!-- 日期标签 -->
            <div class="text-xs opacity-60 mt-2">{{ day.label }}</div>
          </div>
        </div>

        <!-- 签到按钮 -->
        <div class="card-actions justify-center mt-6" v-if="canCheckinToday">
          <button
            class="btn btn-primary btn-wide"
            @click="performCheckin"
            :disabled="isCheckinProcessing"
          >
            <span v-if="isCheckinProcessing" class="loading loading-spinner loading-sm"></span>
            {{ isCheckinProcessing ? '签到中...' : '立即签到' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 记录列表 -->
    <div class="card bg-base-300 max-w-4xl mx-auto mt-6">
      <div class="card-body">
        <!-- 标签页导航 -->
        <div class="tabs tabs-bordered mb-6">
          <button
            v-for="tab in recordTabs"
            :key="tab.key"
            :class="{ 'tab-active': activeRecordTab === tab.key }"
            class="tab tab-lg"
            @click="activeRecordTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- 记录列表 -->
        <div class="space-y-3 sm:space-y-4">
          <div
            v-for="record in currentRecords"
            :key="record.id"
            class="flex items-center justify-between p-3 sm:p-4 bg-base-100 rounded-lg hover:bg-base-200 transition-colors"
          >
            <!-- 左侧信息 -->
            <div class="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <!-- 图标 -->
              <div class="avatar flex-shrink-0">
                <div class="w-8 sm:w-10 rounded-lg bg-secondary">
                  <div class="flex items-center justify-center h-full">
                    <span class="text-secondary-content text-xs sm:text-sm">{{ record.icon }}</span>
                  </div>
                </div>
              </div>

              <!-- 记录信息 -->
              <div class="min-w-0 flex-1">
                <h4 class="font-medium text-sm sm:text-base text-base-content truncate">{{ record.title }}</h4>
                <p class="text-xs sm:text-sm opacity-60 truncate">{{ record.timestamp }}</p>
              </div>
            </div>

            <!-- 右侧信息 -->
            <div class="text-right flex-shrink-0 ml-2">
              <div class="text-xs sm:text-sm opacity-60 mb-1 truncate max-w-[120px] sm:max-w-none">{{ record.description }}</div>
              <div
                :class="[
                  'font-bold text-base sm:text-lg',
                  record.amount > 0 ? 'text-success' : 'text-error'
                ]"
              >
                {{ record.amount > 0 ? '+' : '' }}{{ record.amount }}
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-6" v-if="pagination.totalPages > 1">
          <div class="btn-group">
            <button
              class="btn btn-xs sm:btn-sm"
              :disabled="pagination.currentPage === 1"
              @click="changePage(pagination.currentPage - 1)"
            >
              «
            </button>

            <button
              v-for="page in visiblePages"
              :key="page"
              :class="[
                'btn btn-xs sm:btn-sm',
                pagination.currentPage === page ? 'btn-active' : ''
              ]"
              @click="changePage(page)"
            >
              {{ page }}
            </button>

            <button
              class="btn btn-xs sm:btn-sm"
              :disabled="pagination.currentPage === pagination.totalPages"
              @click="changePage(pagination.currentPage + 1)"
            >
              »
            </button>
          </div>

          <span class="text-xs sm:text-sm opacity-60 mt-2 sm:mt-0">
            第 {{ pagination.currentPage }} 页，共 {{ pagination.totalPages }} 页
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 用户个人信息
const userProfile = ref({
  username: 'mufyer',
  level: 0,
  userId: '439372',
  avatar: '🐱',
  stats: {
    followers: 0,
    interactions: 0,
    characters: 0
  }
})

// 邀请活动数据
const inviteData = ref({
  code: 'TNq5vc4X',
  invited: 0,
  total: 10
})

// 签到数据
const checkinData = ref({
  consecutiveDays: 2,
  days: [
    { label: '第1天', reward: 30, status: 'completed' },
    { label: '今天', reward: 35, status: 'current' },
    { label: '第3天', reward: 40, status: 'pending' },
    { label: '第4天', reward: 45, status: 'pending' },
    { label: '第5天', reward: 50, status: 'pending' },
    { label: '第6天', reward: 50, status: 'pending' },
    { label: '第7天', reward: 50, status: 'pending' }
  ]
})

// 签到状态
const isCheckinProcessing = ref(false)
const canCheckinToday = ref(true)

// 记录标签页
const recordTabs = [
  { key: 'coins', label: '货币消耗' },
  { key: 'recharge', label: '充值记录' },
  { key: 'creation', label: '创作等级' }
]

// 当前选中的记录标签
const activeRecordTab = ref('coins')

// 模拟记录数据
const allRecords = {
  coins: [
    {
      id: 1,
      icon: '🎁',
      title: '免费猫粮',
      timestamp: '2025-09-27 14:37:46',
      description: '每日签到奖励',
      amount: 30
    },
    {
      id: 2,
      icon: '🎁',
      title: '免费猫粮',
      timestamp: '2025-09-25 00:00:51',
      description: '每日签到奖励',
      amount: 30
    },
    {
      id: 3,
      icon: '🎁',
      title: '免费猫粮',
      timestamp: '2025-09-13 23:02:58',
      description: '神秘双子座 记忆加载',
      amount: -3
    },
    {
      id: 4,
      icon: '🎁',
      title: '免费猫粮',
      timestamp: '2025-09-13 20:01:22',
      description: '神秘双子座 记忆加载',
      amount: -3
    },
    {
      id: 5,
      icon: '🎁',
      title: '免费猫粮',
      timestamp: '2025-09-13 19:58:57',
      description: '非中断续写扣费',
      amount: -1
    }
  ],
  recharge: [
    {
      id: 6,
      icon: '💳',
      title: '充值记录',
      timestamp: '2025-09-20 10:30:00',
      description: '支付宝充值',
      amount: 100
    }
  ],
  creation: [
    {
      id: 7,
      icon: '⭐',
      title: '创作等级',
      timestamp: '2025-09-15 16:45:30',
      description: '角色创作奖励',
      amount: 50
    }
  ]
}

// 分页配置
const pagination = ref({
  currentPage: 1,
  pageSize: 5,
  totalPages: 2
})

// 复制用户ID
const copyUserId = async () => {
  try {
    await navigator.clipboard.writeText(userProfile.value.userId)
    console.log('用户ID已复制到剪贴板')
    // 这里可以添加成功提示
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 复制邀请码
const copyInviteCode = async () => {
  try {
    await navigator.clipboard.writeText(inviteData.value.code)
    console.log('邀请码已复制到剪贴板')
    // 这里可以添加成功提示
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 处理签到点击
const handleCheckin = (day) => {
  if (day.status === 'current') {
    performCheckin()
  }
}

// 执行签到
const performCheckin = async () => {
  if (isCheckinProcessing.value) return

  isCheckinProcessing.value = true

  try {
    // 模拟签到请求
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 更新签到状态
    const currentDayIndex = checkinData.value.days.findIndex(day => day.status === 'current')
    if (currentDayIndex !== -1) {
      checkinData.value.days[currentDayIndex].status = 'completed'

      // 如果不是最后一天，设置下一天为当前
      if (currentDayIndex < checkinData.value.days.length - 1) {
        checkinData.value.days[currentDayIndex + 1].status = 'current'
        checkinData.value.consecutiveDays++
      } else {
        // 如果是最后一天，重置周期
        canCheckinToday.value = false
      }
    }

    console.log('签到成功!')
    // 这里可以添加成功提示

  } catch (err) {
    console.error('签到失败:', err)
  } finally {
    isCheckinProcessing.value = false
  }
}

// 计算当前显示的记录
const currentRecords = computed(() => {
  const records = allRecords[activeRecordTab.value] || []
  const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return records.slice(start, end)
})

// 计算可见的页码
const visiblePages = computed(() => {
  const { currentPage, totalPages } = pagination.value
  const pages = []

  // 显示当前页和前后各一页
  const start = Math.max(1, currentPage - 1)
  const end = Math.min(totalPages, currentPage + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// 切换页码
const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.currentPage = page
  }
}
</script>