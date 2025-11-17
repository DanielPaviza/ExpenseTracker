<script setup lang="ts">
  import SwitchSelection from '@components/SwitchSelection.vue'
  import SpendingsCategoryTable from '@components/spendingsList/SpendingsCategoryTable.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'

  import { ref } from 'vue'

  const spendingsStore = useSpendingsStore()

  const defaultTab = 'categories'
  const currentTab = ref<string>(defaultTab)
  const tabs = [
    { name: 'categories', text: 'Nákupy dle kategorií' },
    { name: 'all', text: 'Všechny nákupy v jedné tabulce' },
  ]

  const getSpendingsByCategory = (category: string) => {
    return spendingsStore.spendings.filter((s) => s.category === category)
  }
</script>
<template>
  <div class="mt-8">
    <SwitchSelection :tabs="tabs" v-model="currentTab">
      <template #categories>
        <SpendingsCategoryTable
          v-for="category in spendingsStore.categories"
          :key="category"
          :category="category"
          :spendings="getSpendingsByCategory(category)"
          hideCategoryColumn
        />
      </template>
      <template #all>
        <SpendingsCategoryTable category="Všechny výdaje" :spendings="spendingsStore.spendings" />
      </template>
    </SwitchSelection>
  </div>
</template>
