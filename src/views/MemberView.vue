<template>
  <div class="container mx-auto max-w-6xl p-4">
    <!-- 用户信息卡片 -->
    <UserInfoCard
      :user="userInfo"
      class="mb-6"
    />

    <!-- 会员服务区域 -->
    <section class="space-y-6">
      <!-- 服务类型切换 -->
      <ServiceTabs
        v-model="activeTab"
        :tabs="tabConfig"
      />

      <!-- 服务卡片列表 -->
      <ServiceCardList
        :items="currentItems"
        :type="activeTab"
      />
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import UserInfoCard from '../components/UserInfoCard.vue'
import ServiceTabs from '../components/ServiceTabs.vue'
import ServiceCardList from '../components/ServiceCardList.vue'

// 用户信息
const userInfo = ref({
  avatar: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
  username: 'qqver7296',
  userId: '129235',
  balance: 364.50
})

// 标签页配置
const tabConfig = [
  { key: 'subscription', label: '会员' },
  { key: 'purchase', label: '直购' }
]

// 当前选中的服务类型
const activeTab = ref('subscription')

// 订阅服务数据
const subscriptionPlans = [
  {
    id: 1,
    title: '饲养一个月情懂小mu',
    subtitle: '小mu不知道什么是每日登陆，小mu只知道每天来了就有猫粮吃。',
    price: 4.99,
    period: 'mo',
    priceNote: '价格为标定价格，实际价格以支付时为准。',
    discount: 70,
    tokens: 990,
    progress: 30,
    progressText: '共计3600，预计200余消息',
    features: [
      '立即赠送990奖励罐头',
      '剩余29日内每日登陆获得90r代餐猫粮！'
    ]
  },
  {
    id: 2,
    title: '雇佣一个月见习小mu',
    subtitle: '戴上帽子我的神情就会变得超级严肃！（该会员无差随机，谁饿买）',
    price: 10.99,
    period: 'mo',
    priceNote: '价格为标定价格，实际价格以支付时为准。',
    discount: 80,
    tokens: 2700,
    progress: 60,
    progressText: '清除了滚雪球概率，聊天越长节省越多',
    features: [
      '立即赠送2700奖励罐头',
      '额外的记忆加成，相较普通用户提升80%。'
    ]
  },
  {
    id: 3,
    title: '组队一个月超级mumu',
    subtitle: '亮光一现，今天干犯点什么好呢？（值得拥有）',
    price: 29.99,
    period: 'mo',
    priceNote: '价格为标定价格，实际价格以支付时为准。',
    discount: 85,
    tokens: 6400,
    progress: 90,
    progressText: '共计6400奖励罐头+无法计算的自由',
    features: [
      '立即赠送6400奖励罐头！',
      '小mu引擎官方，选择一天免费游玩权',
      '包含见习mumu的全部功能！'
    ]
  }
]

// 直购商品数据
const purchaseItems = [
  {
    id: 1,
    title: '100猫罐头',
    subtitle: '基础猫罐头补给包',
    price: 1.99,
    priceNote: '一次性购买，立即到账',
    icon: '🥫',
    features: [
      '立即获得100猫罐头',
      '无使用期限',
      '可用于任何对话'
    ]
  },
  {
    id: 2,
    title: '500猫罐头',
    subtitle: '进阶猫罐头补给包',
    price: 8.99,
    priceNote: '一次性购买，立即到账',
    icon: '📦',
    features: [
      '立即获得500猫罐头',
      '比单买节省20%',
      '赠送10个特殊表情'
    ]
  },
  {
    id: 3,
    title: '1000猫罐头',
    subtitle: '豪华猫罐头补给包',
    price: 15.99,
    priceNote: '一次性购买，立即到账',
    icon: '💎',
    features: [
      '立即获得1000猫罐头',
      '比单买节省30%',
      '赠送专属头像框'
    ]
  }
]

// 当前显示的项目列表
const currentItems = computed(() => {
  return activeTab.value === 'subscription' ? subscriptionPlans : purchaseItems
})
</script>