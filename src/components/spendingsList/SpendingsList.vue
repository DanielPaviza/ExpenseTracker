<script setup lang="ts">
  import ButtonNavigation from '@components/ButtonNavigation.vue'
  import DeletedSpendingsTable from '@components/spendingsList/DeletedSpendingsTable.vue'
  import SpendingsCategoryTable from '@components/spendingsList/SpendingsCategoryTable.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'

  import { computed, ref } from 'vue'

  const spendingsStore = useSpendingsStore()

  const currentView = ref<number>(0)
  const viewButtons = [
    { id: 0, label: 'Vše v jedné tabulce' },
    { id: 1, label: 'Dle kategorií' },
    { id: 2, label: 'Dle podkategorií' },
    { id: 3, label: 'Dle obchodů' },
  ]

  const getSpendingsByCategory = (category: string) => {
    return spendingsStore.spendings.filter((s) => s.category === category)
  }

  const getSpendingsBySubCategory = (subCategory: string | null) => {
    return spendingsStore.spendings.filter((s) => s.subCategory === subCategory)
  }

  const getSpendingsByStore = (store: string) => {
    return spendingsStore.spendings.filter((s) => s.store === store)
  }

  const subCategories = computed(() => {
    const subCatSet = new Set(
      spendingsStore.spendings
        .map((s) => s.subCategory)
        .filter((s): s is string => s != null && s !== ''),
    )
    return [...subCatSet].sort()
  })

  const stores = computed(() => {
    const storeSet = new Set(
      spendingsStore.spendings
        .map((s) => s.store)
        .filter((s): s is string => s != null && s !== ''),
    )
    return [...storeSet].sort()
  })
</script>
<template>
  <hr class="my-8 border-blue" />
  <h1 class="font-bold text-2xl text-blue">Zobrazení tabulky nákupů</h1>
  <ButtonNavigation v-model:selected-id="currentView" :buttons="viewButtons" />

  <!-- All spendings view -->
  <div v-if="currentView === 0">
    <SpendingsCategoryTable category="Všechny výdaje" :spendings="spendingsStore.spendings" />
  </div>

  <!-- Category view -->
  <div v-else-if="currentView === 1">
    <SpendingsCategoryTable
      v-for="category in spendingsStore.categories"
      :key="category"
      :category="category"
      :spendings="getSpendingsByCategory(category)"
    />
  </div>

  <!-- Subcategory view -->
  <div v-else-if="currentView === 2">
    <SpendingsCategoryTable
      v-for="subCategory in subCategories"
      :key="subCategory"
      :category="subCategory"
      :spendings="getSpendingsBySubCategory(subCategory)"
      hideCategoryColumn
    />
    <SpendingsCategoryTable
      key="Other_bro"
      category="Ostatní"
      :spendings="getSpendingsBySubCategory(null)"
      hideCategoryColumn
    />
  </div>

  <!-- Store view -->
  <div v-else-if="currentView === 3">
    <SpendingsCategoryTable
      v-for="store in stores"
      :key="store"
      :category="store"
      :spendings="getSpendingsByStore(store)"
    />
  </div>

  <!-- Deleted Spendings Section -->
  <div class="my-8">
    <DeletedSpendingsTable />
  </div>
</template>
