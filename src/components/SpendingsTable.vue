<script setup lang="ts">
import type { Spending } from '../models/Spending';

const { category, spendings } = defineProps<{ 
    category: string, 
    spendings: Spending[] 
}>();
</script>
<template>
  <section class="mb-8">
    <h2 class="text-xl font-bold mb-2 text-left">{{ category }}</h2>
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white dark:bg-zinc-900 rounded shadow">
        <thead>
          <tr class="bg-blue-100 dark:bg-blue-900/30">
            <th class="px-4 py-2 text-left">Název</th>
            <th class="px-4 py-2 text-left">Cena</th>
            <th class="px-4 py-2 text-left">Množství</th>
            <th class="px-4 py-2 text-left">Obchod</th>
            <th class="px-4 py-2 text-left">Zaplaceno</th>
            <th class="px-4 py-2 text-left">Kdo platil</th>
            <th class="px-4 py-2 text-left">Datum</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(s, i) in spendings" :key="i" class="border-b last:border-0">
            <td class="px-4 py-2">{{ s.Name }}</td>
            <td class="px-4 py-2">{{ s.UnitPrice.toLocaleString() }} Kč</td>
            <td class="px-4 py-2">{{ s.Quantity }}</td>
            <td class="px-4 py-2">{{ s.Store || '-' }}</td>
            <td class="px-4 py-2">{{ s.IsPaid ? 'Ano' : 'Ne' }}</td>
            <td class="px-4 py-2">{{ s.PaidBy }}</td>
            <td class="px-4 py-2">{{ new Date(s.CreatedAt).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
