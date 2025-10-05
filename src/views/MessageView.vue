<template>
  <div class="flex h-screen flex-col">
    <MessageHeader :character="character" />

    <div class="flex-1 overflow-y-auto"></div>

    <MessageInput @send="handleSendMessage" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MessageHeader from '../components/MessageHeader.vue'
import MessageInput from '../components/MessageInput.vue'

const character = ref({
  name: '角色名称',
  avatar: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
})

const handleSendMessage = message => {
  console.log('发送消息:', message)
}
</script>
