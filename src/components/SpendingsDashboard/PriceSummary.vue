<script setup lang="ts">
import { computed } from 'vue'
import type { Spending } from '../../models/Spending'

const { spendings } = defineProps<{
  spendings: Spending[]
}>()

const total = computed(() => spendings.reduce((sum, s) => sum + s.UnitPrice * s.Quantity, 0))

const byPaidBy = computed(() => {
  const map: Record<string, number> = {}
  for (const s of spendings) {
    if (!map[s.PaidBy]) map[s.PaidBy] = 0
    map[s.PaidBy] += s.UnitPrice * s.Quantity
  }
  return map
})
</script>
<template>
  <section class="mb-8">
    <div class="bg-white dark:bg-black rounded-lg shadow p-6 flex flex-col gap-4 items-center">
      <div class="text-2xl font-bold">
        Celková cena: <span class="text-blue-700">{{ total.toLocaleString() }} Kč</span>
      </div>
      <div class="flex flex-wrap gap-4 justify-center">
        <div v-for="(sum, name) in byPaidBy" :key="name" class="bg-blue-50 dark:bg-blue-900/30 rounded px-4 py-2">
          <span class="font-semibold">{{ name }}:</span> {{ sum.toLocaleString() }} Kč
        </div>
      </div>
    </div>
  </section>
</template>
