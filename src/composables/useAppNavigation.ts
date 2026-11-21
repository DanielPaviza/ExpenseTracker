import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { BulkEdit } from '@/constants/bulkEdit'

export type AppSection = 'dashboard' | 'spendings'

/**
 * Navigation helpers. Drawers (forms, settings, bulk edit) are child routes of the
 * currently open page, so they always open on top of the page the user is on.
 */
export function useAppNavigation() {
  const router = useRouter()
  const route = useRoute()

  const section = computed<AppSection>(() =>
    route.matched[0]?.path === '/spendings' ? 'spendings' : 'dashboard',
  )
  const basePath = computed(() => `/${section.value}`)

  const openOverlay = (subPath: string, query?: Record<string, string>) =>
    router.push({ path: `${basePath.value}/${subPath}`, query })

  return {
    section,
    goToSection: (target: AppSection) => router.push(`/${target}`),
    openNewSpending: (templateId?: string) =>
      openOverlay('new', templateId ? { template: templateId } : undefined),
    openEditSpending: (id: string) => openOverlay(`edit/${id}`),
    openSettings: () => openOverlay('settings'),
    openBulkEdit: (type: BulkEdit | string, name: string) =>
      openOverlay(`bulkEdit/${type}/${encodeURIComponent(name)}`),
    closeOverlay: () => router.push(basePath.value),
    replaceWithBase: () => router.replace(basePath.value),
  }
}
