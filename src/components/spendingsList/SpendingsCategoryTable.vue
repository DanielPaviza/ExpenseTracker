<script setup lang="ts">
import { useSpendingsStore } from '@stores/spendingsStore'

const { category } = defineProps<{
  category: string
}>()

const spendingsStore = useSpendingsStore()
</script>
<template>
  <section class="mb-8">
    <h2 class="text-xl font-bold mb-2 text-left">{{ category }}</h2>
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white dark:bg-zinc-900 rounded shadow">
        <thead>
          <tr class="bg-blue-100 dark:bg-blue-900/30">
            <th class="px-4 py-2 text-left">Název</th>
            <th class="px-4 py-2 text-left">Cena za kus</th>
            <th class="px-4 py-2 text-left">Množství</th>
            <th class="px-4 py-2 text-left">Celková cena</th>
            <th class="px-4 py-2 text-left">Obchod</th>
            <th class="px-4 py-2 text-left">Kód obchodu</th>
            <th class="px-4 py-2 text-left">Zaplaceno</th>
            <th class="px-4 py-2 text-left">Kdo platil</th>
            <th class="px-4 py-2 text-left">Kategorie</th>
            <th class="px-4 py-2 text-left">Podkategorie</th>
            <th class="px-4 py-2 text-left">Typ</th>
            <th class="px-4 py-2 text-left">Popis</th>
            <th class="px-4 py-2 text-left">Rozměry</th>
            <th class="px-4 py-2 text-left">URL</th>
            <th class="px-4 py-2 text-left">Dokument</th>
            <th class="px-4 py-2 text-left">Datum vytvoření</th>
            <th class="px-4 py-2 text-left">Datum úpravy</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(s, i) in spendingsStore.spendings" :key="i" class="border-b last:border-0">
            <td class="px-4 py-2">{{ s.Name }}</td>
            <td class="px-4 py-2">{{ s.UnitPrice.toLocaleString() }} Kč</td>
            <td class="px-4 py-2">{{ s.Quantity }}</td>
            <td class="px-4 py-2">{{ s.TotalPrice?.toLocaleString() ?? (s.UnitPrice * s.Quantity).toLocaleString() }} Kč
            </td>
            <td class="px-4 py-2">{{ s.Store || '-' }}</td>
            <td class="px-4 py-2">{{ s.StoreCode || '-' }}</td>
            <td class="px-4 py-2">{{ s.IsPaid ? 'Ano' : 'Ne' }}</td>
            <td class="px-4 py-2">{{ s.Payer }}</td>
            <td class="px-4 py-2">{{ s.Category }}</td>
            <td class="px-4 py-2">{{ s.SubCategory || '-' }}</td>
            <td class="px-4 py-2">{{ s.Type }}</td>
            <td class="px-4 py-2">{{ s.Description || '-' }}</td>
            <td class="px-4 py-2">{{ s.Dimensions || '-' }}</td>
            <td class="px-4 py-2"><a v-if="s.Url" :href="s.Url" target="_blank">Odkaz</a><span v-else>-</span></td>
            <td class="px-4 py-2"><a v-if="s.Document" :href="s.Document" target="_blank">Dokument</a><span
                v-else>-</span></td>
            <td class="px-4 py-2">{{ new Date(s.CreatedAt).toLocaleDateString() }}</td>
            <td class="px-4 py-2">{{ s.EditedAt ? new Date(s.EditedAt).toLocaleDateString() : '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
