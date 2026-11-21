<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  import PageHeader from '@/components/layout/PageHeader.vue'
  import SpendingsList from '@/components/spendingsList/SpendingsList.vue'
  import { useSpendingsStore } from '@/stores/spendingsStore'

  const { t } = useI18n()
  const store = useSpendingsStore()
  const subtitle = computed(
    () => `${t('pages.spendingsSubtitle')} · ${store.categoryView ?? t('common.allCategories')}`,
  )
</script>

<template>
  <div>
    <PageHeader :title="t('nav.spendings')" :subtitle="subtitle" />
    <SpendingsList />
    <router-view />
  </div>
</template>
