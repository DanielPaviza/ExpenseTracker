<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  import { formatDateLocalized } from '@/composables/useDateFormat'
  import type { Spending } from '@/types/Spending'

  const { spending } = defineProps<{
    spending: Spending
  }>()
  const { t } = useI18n()
</script>

<template>
  <div v-if="spending.createdAt" class="flex gap-8 text-sm mb-4">
    <div>
      <span class="font-semibold text-gray-700">{{ t('form.created') }}:</span>
      <span class="ml-1 text-gray-600">{{ formatDateLocalized(spending.createdAt, 'long') }}</span>
    </div>
    <div v-if="spending.editedAt">
      <span class="font-semibold text-gray-700">{{ t('form.edited') }}:</span>
      <span class="ml-1 text-gray-600">{{ formatDateLocalized(spending.editedAt, 'long') }}</span>
    </div>
  </div>
</template>
