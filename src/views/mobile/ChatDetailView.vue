<template>
  <!-- 聊天内容区域 -->
  <div class="flex flex-col h-screen">
    <!-- 消息列表 -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <div
        v-for="message in messages"
        :key="message.id"
        class="flex"
        :class="message.isUser ? 'justify-end' : 'justify-start'"
      >
        <div
          class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg"
          :class="message.isUser
            ? 'bg-primary text-primary-content'
            : 'bg-base-200 text-base-content'"
        >
          {{ message.content }}
        </div>
      </div>
    </div>

      <!-- 输入区域 -->
      <div class="border-t border-base-300 p-4">
        <div class="flex gap-2">
          <input
            v-model="newMessage"
            type="text"
            placeholder="输入消息..."
            class="input input-bordered flex-1"
            @keyup.enter="sendMessage"
          />
          <button
            @click="sendMessage"
            class="btn btn-primary"
            :disabled="!newMessage.trim()"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 聊天数据
const chatData = ref({
  id: null,
  name: '',
  avatar: ''
})

// 消息列表
const messages = ref([
  {
    id: 1,
    content: '你好！欢迎来到聊天页面。',
    isUser: false
  },
  {
    id: 2,
    content: '你好！这是一个独立的聊天页面，没有底部导航。',
    isUser: true
  },
  {
    id: 3,
    content: '这是一个很好的例子，展示了如何创建移动端独立页面。',
    isUser: false
  }
])

// 新消息
const newMessage = ref('')

// 初始化聊天数据
onMounted(() => {
  const chatId = route.params.id

  // 模拟从API获取聊天数据
  chatData.value = {
    id: chatId,
    name: `聊天对象 ${chatId}`,
    avatar: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
  }
})

// 发送消息
const sendMessage = () => {
  if (newMessage.value.trim()) {
    messages.value.push({
      id: Date.now(),
      content: newMessage.value,
      isUser: true
    })
    newMessage.value = ''

    // 模拟回复
    setTimeout(() => {
      messages.value.push({
        id: Date.now() + 1,
        content: '收到你的消息！',
        isUser: false
      })
    }, 1000)
  }
}
</script>