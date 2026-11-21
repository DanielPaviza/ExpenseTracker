import { type RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router'

import BulkEditForm from '@/views/BulkEditForm.vue'
import DashboardPage from '@/views/DashboardPage.vue'
import Settings from '@/views/Settings.vue'
import SpendingForm from '@/views/SpendingForm.vue'
import SpendingsPage from '@/views/SpendingsPage.vue'

/** Drawer routes available on top of every page */
function overlayRoutes(section: string): RouteRecordRaw[] {
  return [
    { path: 'new', name: `${section}-new-spending`, component: SpendingForm },
    { path: 'edit/:id', name: `${section}-edit-spending`, component: SpendingForm },
    { path: 'settings', name: `${section}-settings`, component: Settings },
    { path: 'bulkEdit/:type/:name', name: `${section}-edit-bulk`, component: BulkEditForm },
  ]
}

// Hash history works reliably with Tauri's custom protocol (no server-side fallback needed)
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'root', redirect: '/dashboard' },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardPage,
      children: overlayRoutes('dashboard'),
    },
    {
      path: '/spendings',
      name: 'spendings',
      component: SpendingsPage,
      children: overlayRoutes('spendings'),
    },
    { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
  ],
})

export default router
