<script setup lang="ts">
import { Spending } from '@models/Spending'
import { useSpendingsStore } from '@stores/spendingsStore'
import { formatNumber } from '@utils/formatUtils';

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
  <div class="bg-grayLight dark:bg-black rounded-lg shadow p-6 py-4 flex flex-col gap-4 items-center w-fit">
    <div class="text-xl font-bold text-blueLight">
      Celkové výdaje
    </div>
    <div class="flex flex-col gap-1 text-lg whitespace-nowrap ">
      <div v-for="payer in store.payers ? store.payers : []" :key="payer" class="flex">
        <div class="font-bold min-w-[30px] w-full">{{ payer }}:</div>
        <div class="font-semibold text-blueLight">{{ formatNumber(priceByPayer(payer)) }} Kč</div>
      </div>
      <div class="mt-2 pt-2 border-t-2 border-primaryLight flex font-bold">
        Celkem:
        <div class="text-blueDark ms-3">{{ formatNumber(totalPrice()) }} Kč</div>
      </div>
    </div>
  </div>
</template>
