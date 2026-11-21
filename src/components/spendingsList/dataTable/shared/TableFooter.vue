<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  import { formatCurrency } from '@/composables/useCurrencyFormat'

  const { t } = useI18n()

  const { totalCount, totalPrice, columnCount } = defineProps<{
    totalCount: number
    totalPrice: number
    columnCount: number
  }>()
</script>

<template>
  <tfoot>
    <tr class="bg-surface-2 text-sm font-semibold text-fg">
      <td class="px-4 py-3">
        {{ t('table.total') }}
        <span class="ms-1 font-normal text-fg-muted">({{ totalCount }})</span>
      </td>
      <td v-for="_ in columnCount - 2" :key="_" />
      <td class="px-4 py-3 text-base whitespace-nowrap tabular-nums">
        {{ formatCurrency(totalPrice) }}
      </td>
      <td />
    </tr>
  </tfoot>
</template>
