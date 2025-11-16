<script setup lang="ts">
import { Spending } from '@models/Spending'
import { useSpendingsStore } from '@stores/spendingsStore'

const store = useSpendingsStore()

console.log(store.spendings)

const priceByPayer = (payer: string) =>
  store.spendings
    ? store.spendings.filter((s: Spending) => s.payer === payer).reduce((sum: number, s: Spending) => sum + s.totalPrice, 0)
    : 0

const totalPrice = () =>
  store.spendings
    ? store.spendings.reduce((sum: number, s: Spending) => sum + s.totalPrice, 0)
    : 0
</script>
<template>
  <section class="mb-8">
    <div class="bg-white dark:bg-black rounded-lg shadow p-6 flex flex-col gap-4 items-center">
      <div class="text-2xl font-bold mb-8">
        Celková cena: <span class="text-blue-700">{{ totalPrice() }} Kč</span>
      </div>
      <div class="flex flex-wrap gap-4 justify-center">
        <div v-for="payer in store.payers ? store.payers : []" :key="payer"
          class="bg-blue-50 dark:bg-blue-900/30 rounded px-4 py-2">
          <span class="font-semibold">{{ payer }}:</span> {{ priceByPayer(payer) }} Kč
        </div>
      </div>
    </div>
  </section>
</template>
