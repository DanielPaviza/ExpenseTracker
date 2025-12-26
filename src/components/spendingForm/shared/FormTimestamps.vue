<script setup lang="ts">
  import { formatDate } from '@utils/formatUtils'

  import { useI18n } from 'vue-i18n'

  import type { Spending } from '@/types/Spending'

  interface Props {
    spending: Spending
  }

  defineProps<Props>()
  const { t } = useI18n()
</script>

<template>
  <div v-if="spending.createdAt" class="flex gap-8 text-sm mb-4">
    <div>
      <span class="font-semibold text-gray-700">{{ t('form.created') }}:</span>
      <span class="ml-1 text-gray-600">{{ formatDate(spending.createdAt) }}</span>
    </div>
    <div v-if="spending.editedAt">
      <span class="font-semibold text-gray-700">{{ t('form.edited') }}:</span>
      <span class="ml-1 text-gray-600">{{ formatDate(spending.editedAt) }}</span>
    </div>
  </div>
</template>
