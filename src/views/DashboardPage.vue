<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  import PageHeader from '@/components/layout/PageHeader.vue'
  import SpendingsDashboard from '@/components/spendingsDashboard/Dashboard.vue'
  import { useSpendingsStore } from '@/stores/spendingsStore'

  const { t } = useI18n()
  const store = useSpendingsStore()
  const subtitle = computed(
    () => `${t('pages.dashboardSubtitle')} · ${store.categoryView ?? t('common.allCategories')}`,
  )
</script>

<template>
  <div>
    <PageHeader :title="t('nav.dashboard')" :subtitle="subtitle" />
    <SpendingsDashboard />
    <router-view />
  </div>
</template>
