import { createRouter, createWebHistory } from 'vue-router'
import ExploreView from '../views/ExploreView.vue'
import ChatView from '../views/ChatView.vue'
import CreateView from '../views/CreateView.vue'
import MessageView from '../views/MessageView.vue'
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
      path: '/message',
      name: 'message',
      component: MessageView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    }
  ],
})

export default router
