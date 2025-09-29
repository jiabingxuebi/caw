import { createRouter, createWebHistory } from 'vue-router'
import ExploreView from '../views/ExploreView.vue'
import ChatView from '../views/ChatView.vue'
import CreateView from '../views/CreateView.vue'
import MemberView from '../views/MemberView.vue'
import ProfileView from '../views/ProfileView.vue'

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
    }
    // 未来可以在这里添加独立页面路由
    // {
    //   path: '/chat/:id',
    //   name: 'chat-detail',
    //   component: ChatDetailView
    // },
    // {
    //   path: '/settings',
    //   name: 'settings',
    //   component: SettingsView
    // }
  ],
})

export default router
