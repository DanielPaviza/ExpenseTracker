<script setup lang="ts">
  import SummaryCard from '@components/SpendingsDashboard/Summary/SummaryCard.vue'
  import { Spending } from '@models/Spending'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { formatNumberToCzk } from '@utils/formatUtils'
  import { storeToRefs } from 'pinia'

  import { computed } from 'vue'

  const store = useSpendingsStore()
  const { spendings, totalPrice } = storeToRefs(store)

  const totalItems = computed(() =>
    spendings.value
      .filter((s: Spending) => !s.isFree && !s.isToBePaid)
      .reduce((sum: number, s: Spending) => sum + s.quantity, 0),
  )

  const paidSpendings = computed(() =>
    spendings.value.filter((s: Spending) => !s.isFree && !s.isToBePaid),
  )

  const averagePricePerItem = computed(() => {
    if (totalItems.value === 0) return 0
    return totalPrice.value / totalItems.value
  })

  const averagePricePerSpending = computed(() => {
    if (paidSpendings.value.length === 0) return 0
    return totalPrice.value / paidSpendings.value.length
  })

  const averageItemsPerSpending = computed(() => {
    if (paidSpendings.value.length === 0) return 0
    return totalItems.value / paidSpendings.value.length
  })
</script>

<template>
  <SummaryCard title="Statistiky nákupů" :subtitle="`${paidSpendings.length} nákupů`">
    <div class="flex text-base gap-10">
      <div class="space-y-2">
        <div class="flex justify-between gap-4">
          <span class="font-bold text-blue gap-4">Nákupy:</span>
          <span class="font-semibold">{{ paidSpendings.length }}</span>
        </div>
        <div class="flex justify-between gap-4">
          <span class="font-bold text-blue">Ø na nákup:</span>
          <span class="font-semibold">{{ formatNumberToCzk(averagePricePerSpending) }}</span>
        </div>
      </div>
      <div class="space-y-2">
        <div class="flex justify-between gap-4">
          <span class="font-bold text-blue">Položky:</span>
          <span class="font-semibold">{{ totalItems }}</span>
        </div>
        <div class="flex justify-between gap-4">
          <span class="font-bold text-blue">Ø položek:</span>
          <span class="font-semibold">{{ averageItemsPerSpending.toFixed(1) }}</span>
        </div>
        <div class="flex justify-between gap-4">
          <span class="font-bold text-blue">Ø na položku:</span>
          <span class="font-semibold">{{ formatNumberToCzk(averagePricePerItem) }}</span>
        </div>
      </div>
    </div>
  </SummaryCard>
</template>
