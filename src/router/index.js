import { createRouter, createWebHistory } from 'vue-router'
import ExploreView from '../views/ExploreView.vue'
import ChatView from '../views/ChatView.vue'
import CreateView from '../views/CreateView.vue'
import MemberView from '../views/MemberView.vue'
import ProfileView from '../views/ProfileView.vue'
import MessageView from '../views/MessageView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/explore'
    },
    {
      path: '/explore',
      name: 'explore',
      component: ExploreView
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatView
    },
    {
      path: '/create',
      name: 'create',
      component: CreateView
    },
    {
      path: '/member',
      name: 'member',
      component: MemberView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    // 独立页面路由（移动端无底部导航）
    {
      path: '/message',
      name: 'message',
      component: MessageView,
      meta: { standalone: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/mobile/SettingsView.vue'),
      meta: { standalone: true }
    },
    {
      path: '/chat/:id',
      name: 'chat-detail',
      component: () => import('../views/mobile/ChatDetailView.vue'),
      meta: { standalone: true }
    },
    {
      path: '/character/:id',
      name: 'character-detail',
      component: () => import('../views/mobile/CharacterDetailView.vue'),
      meta: { standalone: true }
    }
  ],
})

export default router
