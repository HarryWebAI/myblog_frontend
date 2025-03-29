import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import WelcomeView from '../views/WelcomeView.vue'
import HomeView from '../views/HomeView.vue'
import AboutmeView from '@/views/AboutmeView.vue'
import BlogView from '@/views/BlogView.vue'
import BoardView from '@/views/BoardView.vue'
import AdminView from '@/views/AdminView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import UserInfoView from '@/views/UserInfoView.vue'
import WelcomeAdminView from '@/views/WelcomeAdmin.vue'
import AboutmeAdminView from '@/views/AboutmeAdmin.vue'
import UserAdminView from '@/views/UserAdmin.vue'
import ActiveView from '@/views/ActiveView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: WelcomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        if (authStore.isLoggedIn()) {
          next({ name: 'home' })
        } else {
          next()
        }
      },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        if (authStore.isLoggedIn()) {
          next({ name: 'home' })
        } else {
          next()
        }
      },
    },
    {
      path: '/active',
      name: 'active',
      component: ActiveView,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        if (authStore.isLoggedIn()) {
          next({ name: 'home' })
        } else {
          next()
        }
      },
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        if (authStore.isLoggedIn() && authStore.isSuperuser()) {
          next()
        } else {
          next({ name: 'login' })
        }
      },
      children: [
        {
          path: 'welcomeadmin',
          name: 'welcomeadmin',
          component: WelcomeAdminView,
        },
        {
          path: 'aboutmeadmin',
          name: 'aboutmeadmin',
          component: AboutmeAdminView,
        },
        {
          path: 'useradmin',
          name: 'useradmin',
          component: UserAdminView,
        },
      ],
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      redirect: '/home/aboutme',
      children: [
        {
          path: 'aboutme',
          name: 'aboutme',
          component: AboutmeView,
        },
        {
          path: 'blog',
          name: 'blog',
          component: BlogView,
        },
        {
          path: 'board',
          name: 'board',
          component: BoardView,
        },
        {
          path: 'userinfo',
          name: 'userinfo',
          component: UserInfoView,
          beforeEnter: (to, from, next) => {
            const authStore = useAuthStore()
            if (authStore.isLoggedIn()) {
              next()
            } else {
              next({ name: 'login' })
            }
          },
        },
      ],
    },
  ],
})

export default router
