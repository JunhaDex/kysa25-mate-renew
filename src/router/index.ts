import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/pages/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/Login.vue'),
    },
    {
      path: '/group/',
      children: [
        {
          path: '',
          name: 'group-list',
          component: () => import('@/pages/group/List.vue'),
        },
        {
          path: ':id',
          name: 'group-detail',
          props: true,
          component: () => import('@/pages/group/Detail.vue'),
        },
        {
          path: ':id/new',
          name: 'group-new',
          props: true,
          component: () => import('@/pages/group/New.vue'),
        },
      ],
    },
    {
      path: '/friend/',
      children: [
        {
          path: '',
          name: 'friend-list',
          component: () => import('@/pages/friend/List.vue'),
        },
      ],
    },
    {
      path: '/chat/',
      children: [
        {
          path: '',
          name: 'chat-list',
          component: () => import('@/pages/chat/List.vue'),
        },
        {
          path: ':id',
          name: 'chat-detail',
          props: true,
          component: () => import('@/pages/chat/Room.vue'),
        },
      ],
    },
    {
      path: '/user/profile',
      name: 'user-profile',
      component: () => import('@/pages/user/Profile.vue'),
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('@/pages/Error.vue'),
    },
    {
      path: '/not-found',
      name: 'not-found',
      component: () => import('@/pages/Error.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'not-found' },
    },
  ],
})

export default router
