<template>
  <div class="card bg-base-100 shadow-sm group cursor-pointer">
    <figure class="relative aspect-[3/4] overflow-hidden rounded-t-xl lg:aspect-[4/5]">
      <img
        :src="character.image"
        :alt="character.name"
        class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
      />

      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 via-black/20 to-transparent"></div>

      <div class="absolute top-3 left-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
        {{ character.username }}
      </div>

      <div class="absolute bottom-0 left-0 right-0 p-3 lg:p-5">
        <h3 class="text-white font-bold text-sm lg:text-base mb-1">{{ character.name }}</h3>

        <p
          class="text-white/90 text-xs lg:text-sm mb-2 truncate"
          :title="character.description"
        >
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
})
</script>
