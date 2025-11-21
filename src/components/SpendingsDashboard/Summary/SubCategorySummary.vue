<script setup lang="ts">
  import SummaryCard from '@components/SpendingsDashboard/Summary/SummaryCard.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { formatNumberToCzk, generateColorPalette } from '@utils/formatUtils'

  import { computed } from 'vue'

  const { spendings, totalPrice } = useSpendingsStore()

  const subCategories = computed(() => {
    const set = new Set<string>()
    for (const s of spendings) {
      if (s.subCategory) set.add(s.subCategory)
    }
    return Array.from(set)
  })

  const subCategoryStats = computed(() => {
    return subCategories.value
      .map((sub) => {
        const subCategorySpendings = spendings.filter((s) => s.subCategory === sub)
        const price = subCategorySpendings.reduce((sum, s) => sum + s.totalPrice, 0)
        const count = subCategorySpendings.length
        const percent = totalPrice > 0 ? Math.round((price / totalPrice) * 100) : 0
        return { name: sub, price, count, percent }
      })
      .sort((a, b) => b.price - a.price)
  })

  const chartLabels = computed(() => subCategoryStats.value.map((s) => `${s.name} (${s.percent}%)`))
  const chartDatasets = computed(() => [
    {
      label: 'Výdaje dle podkategorií',
      data: subCategoryStats.value.map((s) => s.price),
      backgroundColor: generateColorPalette(
        ['#10b981', '#34d399', '#6ee7b7'],
        subCategoryStats.value.length,
      ),
    },
  ])
</script>

<template>
  <SummaryCard
    v-if="subCategories.length > 0"
    title="Výdaje dle podkategorií"
    :subtitle="`${subCategories.length} podkategorií`"
    chart-type="Doughnut"
    :chart-type-change-enabled="true"
    :chart-labels="chartLabels"
    :chart-datasets="chartDatasets"
  >
    <div v-for="sub in subCategoryStats" :key="sub.name" class="flex items-center gap-2 text-base">
      <div class="font-bold min-w-[100px] text-blue truncate" :title="sub.name">
        {{ sub.name }}:
      </div>
      <div class="font-semibold whitespace-nowrap">{{ formatNumberToCzk(sub.price) }}</div>
      <div class="text-blue text-xs text-muted-foreground">({{ sub.count }}×)</div>
    </div>
  </SummaryCard>
</template>
