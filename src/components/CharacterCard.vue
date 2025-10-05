<template>
  <div class="card bg-base-100 shadow-sm group cursor-pointer" @click="handleClick">
    <figure class="relative aspect-[3/4] overflow-hidden rounded-t-xl lg:aspect-[4/5]">
      <img
        :src="character.image"
        :alt="character.name"
        class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
      />

      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 via-black/20 to-transparent"></div>

      <!-- 草稿标志优先显示，否则显示用户名 -->
      <div v-if="character.visibility === 'private'" class="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
        草稿
      </div>
      <div v-else class="absolute top-3 left-3 bg-black/40 text-white px-2 py-1 rounded-full text-xs">
        {{ character.username }}
      </div>

      <!-- 三点菜单 - 只在showActions为true时显示 -->
      <div v-if="showActions" class="absolute top-3 right-3">
        <div class="dropdown dropdown-end">
          <button
            tabindex="0"
            @click.stop
            class="btn btn-circle btn-sm bg-transparent hover:bg-white/20 border-none text-white shadow-none"
            title="更多操作"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
          <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-32 p-2 shadow-lg">
            <li>
              <button
                @click.stop="$emit('edit', character)"
                class="flex items-center gap-2 text-sm"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                编辑
              </button>
            </li>
            <li>
              <button
                @click.stop="$emit('delete', character)"
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
                删除
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div class="absolute bottom-0 left-0 right-0 p-3 lg:p-5">
        <h3 class="text-white font-bold text-sm lg:text-base mb-1">{{ character.name }}</h3>

        <p class="text-white/90 text-xs lg:text-sm mb-2 truncate" :title="character.description">
          {{ character.description }}
        </p>

        <div class="flex items-center gap-2 lg:gap-3 text-white/80 text-xs lg:text-sm">
          <div class="flex items-center gap-1">
            <svg class="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span>{{ character.conversations }}</span>
          </div>

          <div class="flex items-center gap-1">
            <svg class="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 000-6.364 4.5 4.5 0 00-6.364 0L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>{{ character.likes }}</span>
          </div>
        </div>
      </div>
    </figure>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  character: {
    type: Object,
    required: true,
    default: () => ({
      name: '',
      username: '',
      description: '',
      image: '',
      tags: [],
      conversations: 0,
      likes: 0,
      users: 0,
    }),
  },
  showActions: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['edit', 'delete'])

const handleClick = () => {
  router.push('/message')
}
</script>
