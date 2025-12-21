<script setup lang="ts">
  import SummaryCard from '@components/SpendingsDashboard/Summary/SummaryCard.vue'
  import { useItemsLimit } from '@composables/useItemsLimit'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { formatNumberToCzk } from '@utils/formatUtils'
  import { storeToRefs } from 'pinia'

  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const store = useSpendingsStore()
  const { spendings, totalPrice } = storeToRefs(store)

  const freeSpendings = computed(() => spendings.value.filter((s) => s.isFree))

  const {
    displayedItems: displayedFreeSpendings,
    hasMore,
    toggleText,
    showAll,
  } = useItemsLimit(freeSpendings)

  const priceFree = computed(() => freeSpendings.value.reduce((sum, s) => sum + s.totalPrice, 0))

  const priceTotalWithFree = computed(() => totalPrice.value + priceFree.value)

  const priceFreePercent = computed(() => {
    const total = priceTotalWithFree.value
    if (!total || total === 0) return 0
    return Math.round((priceFree.value / total) * 100)
  })

  const chartLabels = computed(() => [
    `${t('summary.paid')} (${100 - priceFreePercent.value}%)`,
    `${t('summary.free')} (${priceFreePercent.value}%)`,
  ])
  const chartDatasets = computed(() => [
    {
      label: t('summary.savedExpenses'),
      data: [totalPrice.value, priceFree.value],
      backgroundColor: ['#06402b', '#10b981'],
    },
  ])
</script>

<template>
  <SummaryCard
    :title="$t('summary.savedExpenses')"
    :subtitle="`${freeSpendings.length} ${$t('summary.items')}`"
    chart-type="Doughnut"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
  >
    <div class="max-w-[90%]">
      <div class="flex justify-between">
        <div class="font-bold text-blue me-3">{{ $t('summary.totalPaid') }}:</div>
        <div class="font-semibold">{{ formatNumberToCzk(totalPrice) }}</div>
      </div>
      <div class="flex justify-between">
        <div class="font-bold text-blue">{{ $t('summary.saved') }}:</div>
        <div class="font-semibold text-green-600">{{ formatNumberToCzk(priceFree) }}</div>
      </div>
      <div class="flex justify-between text-sm text-gray-500">
        <div>({{ $t('summary.totalWithSaved') }})</div>
        <div>{{ formatNumberToCzk(priceTotalWithFree) }}</div>
      </div>
      <div class="border-t border-blue mt-4">
        <div class="text-blue mb-2 mt-4">{{ $t('summary.freeItems') }}:</div>
        <div class="pr-2 text-sm">
          <div
            v-for="spending in displayedFreeSpendings"
            :key="spending.id"
            class="flex space-y-1 items-center gap-4"
          >
            <span class="truncate font-semibold" :title="spending.name">{{ spending.name }}</span>
            <span class="font-semibold whitespace-nowrap">{{
              formatNumberToCzk(spending.totalPrice)
            }}</span>
            <span v-if="spending.store">-> {{ spending.store }}</span>
          </div>
          <div v-if="freeSpendings.length === 0" class="text-gray-500">
            {{ $t('summary.noSavedExpenses') }}
          </div>
        </div>
        <div
          v-if="hasMore"
          @click="showAll = !showAll"
          class="mt-1 text-blueLight text-xs cursor-pointer"
        >
          {{ toggleText }}
        </div>
      </div>
    </div>
  </SummaryCard>
</template>
