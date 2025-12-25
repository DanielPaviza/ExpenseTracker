<script setup lang="ts">
  import SummaryCard from '@components/SpendingsDashboard/Summary/SummaryCard.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { formatDateShort } from '@utils/formatUtils'
  import { NButton, NButtonGroup, NInputNumber } from 'naive-ui'
  import { storeToRefs } from 'pinia'

  import { computed, ref } from 'vue'

  import { formatCurrency } from '@/composables/useCurrencyFormat'
  import { Spending } from '@/types/Spending'

  const store = useSpendingsStore()
  const { spendings } = storeToRefs(store)

  const lastSpendingCount = ref(8)
  const showAll = ref(false)
  type SortType = 'date-desc' | 'price-desc'
  const sortBy = ref<SortType>('date-desc')

  const sortedSpendings = computed(() => {
    const sorted = [...spendings.value].filter((s: Spending) => !s.isFree && !s.isToBePaid)
    if (sortBy.value === 'price-desc') {
      return sorted.sort((a, b) => b.totalPrice - a.totalPrice)
    }
    // Default to date-desc
    return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  })

  const recentSpendings = computed(() => {
    if (showAll.value) {
      return sortedSpendings.value
    }
    return sortedSpendings.value.slice(0, lastSpendingCount.value)
  })
</script>

<template>
  <SummaryCard
    :title="`Poslední nákupy`"
    :subtitle="showAll ? 'Všechny nákupy' : `Posledních ${lastSpendingCount} nákupů`"
    :show-footer="true"
    :compact-mode="true"
  >
    <div class="flex justify-between items-center mb-3 flex-wrap gap-2">
      <n-button-group size="tiny">
        <n-button
          :type="sortBy === 'date-desc' ? 'primary' : 'default'"
          @click="sortBy = 'date-desc'"
        >
          Datum ↓
        </n-button>
        <n-button
          :type="sortBy === 'price-desc' ? 'primary' : 'default'"
          @click="sortBy = 'price-desc'"
        >
          Cena ↓
        </n-button>
      </n-button-group>
      <div class="flex items-center gap-2">
        <n-input-number
          v-model:value="lastSpendingCount"
          size="tiny"
          :min="1"
          :max="spendings.length"
          :disabled="showAll"
          style="width: 70px"
        />
        <n-button size="tiny" @click="showAll = !showAll">
          {{
            showAll
              ? $t('common.showLess')
              : $t('common.showAll', { count: recentSpendings.length })
          }}
        </n-button>
      </div>
    </div>
    <div class="overflow-y-auto max-h-64 pr-2">
      <div
        v-for="spending in recentSpendings"
        :key="spending.id"
        class="flex items-center gap-2 text-sm mb-1"
      >
        <div class="font-semibold text-blue text-xs w-[65px] shrink-0">
          {{ formatDateShort(spending.createdAt) }}
        </div>
        <div class="font-bold w-full truncate" :title="spending.name">
          {{ spending.name }}
        </div>
        <div class="ms-2 font-semibold whitespace-nowrap">
          {{ formatCurrency(spending.totalPrice) }}
        </div>
      </div>
    </div>
  </SummaryCard>
</template>
