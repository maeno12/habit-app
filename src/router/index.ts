import { createRouter, createWebHistory } from 'vue-router'
import { useHabit } from '../composables/useHabit'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { title: '習慣の記録' }
    },
    {
      path: '/welcome',
      name: 'welcome',
      component: () => import('../views/WelcomeView.vue'),
      meta: { title: '習慣の記録' }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: { title: '設定' }
    }
  ]
})

router.beforeEach((to, _from, next) => {
  const { hasGoal } = useHabit()
  if (to.name === 'welcome' && hasGoal()) return next({ name: 'home' })
  if (to.name === 'home' && !hasGoal()) return next({ name: 'welcome' })
  next()
})

export default router
