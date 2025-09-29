<template>
  <div class="p-4">
    <!-- 聊天列表 -->
    <div class="space-y-2">
      <div
        v-for="chat in chatList"
        :key="chat.id"
        class="flex items-center gap-4 p-4 bg-base-100 hover:bg-base-200 rounded-lg transition-colors cursor-pointer border border-base-300"
        @click="openChat(chat)"
        @contextmenu.prevent="showContextMenu(chat, $event)"
        @touchstart="startLongPress(chat, $event)"
        @touchend="endLongPress"
        @touchmove="endLongPress"
      >
        <!-- 头像 -->
        <div class="flex-shrink-0">
          <img :src="chat.avatar" :alt="chat.name" class="w-12 h-12 rounded-full object-cover" />
        </div>

        <!-- 聊天信息 -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-1">
            <h3 class="text-base font-semibold text-base-content truncate">
              {{ chat.name }}
            </h3>
            <time class="text-xs text-base-content/60 flex-shrink-0">
              {{ formatTime(chat.lastMessageTime) }}
            </time>
          </div>
          <p class="text-sm text-base-content/70 truncate leading-relaxed">
            {{ chat.lastMessage }}
          </p>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="chatList.length === 0" class="flex flex-col items-center justify-center py-16">
      <div class="w-24 h-24 bg-base-200 rounded-full flex items-center justify-center mb-6">
        <svg class="w-12 h-12 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-base-content mb-2">还没有聊天记录</h2>
      <p class="text-base-content/60 text-center mb-6 max-w-sm">去探索页面找到感兴趣的角色，开始你的第一次对话吧。</p>
      <button @click="goToExplore" class="btn btn-primary gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        去探索
      </button>
    </div>

    <!-- 上下文菜单 -->
    <div
      v-if="contextMenu.show"
      class="fixed z-50 dropdown-content menu bg-base-100 rounded-box w-32 p-2 shadow-lg border border-base-300"
      :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
      @click.stop
    >
      <li>
        <button
          @click="deleteChat(contextMenu.chat.id)"
          class="flex items-center gap-2 text-sm text-error hover:text-error"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          删除聊天
        </button>
      </li>
    </div>

    <!-- 点击空白处隐藏菜单 -->
    <div
      v-if="contextMenu.show"
      class="fixed inset-0 z-40"
      @click="hideContextMenu"
    ></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 上下文菜单状态
const contextMenu = ref({
  show: false,
  chat: null,
  x: 0,
  y: 0
})

// 长按定时器
let longPressTimer = null

// 模拟聊天数据
const chatList = ref([
  {
    id: 1,
    name: '欢迎来到无限游戏',
    avatar: 'https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp',
    lastMessage: '"你好？"她的声音像淬了露水的刀，"先看清楚脚下的泥——看见墙根那几个村民没？他们已经死了很久了。"',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30分钟前
    unreadCount: 3,
  },
  {
    id: 2,
    name: 'Elara Nightshade',
    avatar: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
    lastMessage: '你在一个有趣的时刻找到了我。古老的文字在低语，废墟在召唤。我们要不要一起揭开隐藏在下面的秘密？',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2小时前
    unreadCount: 0,
  },
  {
    id: 3,
    name: 'Marcus Steel',
    avatar: 'https://img.daisyui.com/images/stock/photo-1565564040-0f35735fb8bb.webp',
    lastMessage: '欢迎来到未来世界，这里有无限的可能等待着我们去探索。让我们一起谈论科技和人工智能的未来吧。',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1天前
    unreadCount: 1,
  },
  {
    id: 4,
    name: 'Luna Moonwhisper',
    avatar: 'https://img.daisyui.com/images/stock/photo-1580489944761-15a19d654956.webp',
    lastMessage: '星辰指引着命运的轨迹，让我为你解读天空中隐藏的秘密。今晚的月亮特别明亮...',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3天前
    unreadCount: 0,
  },
])

// 格式化时间显示
const formatTime = date => {
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) {
    return minutes === 0 ? '刚刚' : `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
  }
}

// 打开聊天
const openChat = chat => {
  console.log('打开聊天:', chat.name)
  // 这里可以跳转到具体的聊天页面
  // router.push(`/chat/${chat.id}`)
}

// 显示上下文菜单
const showContextMenu = (chat, event) => {
  contextMenu.value = {
    show: true,
    chat: chat,
    x: event.clientX || (event.touches && event.touches[0].clientX) || 0,
    y: event.clientY || (event.touches && event.touches[0].clientY) || 0
  }
}

// 隐藏上下文菜单
const hideContextMenu = () => {
  contextMenu.value.show = false
}

// 开始长按
const startLongPress = (chat, event) => {
  longPressTimer = setTimeout(() => {
    showContextMenu(chat, event)
  }, 500)
}

// 结束长按
const endLongPress = () => {
  if (longPressTimer) {
    clearTimeout(longPressTimer)
    longPressTimer = null
  }
}

// 删除聊天
const deleteChat = (chatId) => {
  if (confirm('确定要删除这个聊天记录吗？')) {
    const index = chatList.value.findIndex(chat => chat.id === chatId)
    if (index !== -1) {
      chatList.value.splice(index, 1)
    }
  }
  hideContextMenu()
}

// 去探索页面
const goToExplore = () => {
  router.push('/explore')
}
</script>
