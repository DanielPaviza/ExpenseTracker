<script setup lang="ts">
  import ButtonNavigation from '@components/ButtonNavigation.vue'
  import DeletedSpendingsTable from '@components/spendingsList/DeletedSpendingsTable.vue'
  import SpendingsCategoryTable from '@components/spendingsList/SpendingsCategoryTable.vue'
  import { SpendingsColumns } from '@components/spendingsList/SpendingsColumns'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { NSelect } from 'naive-ui'

  import { computed, ref, watch } from 'vue'

  import { Spending } from '@/types/Spending'

  const spendingsStore = useSpendingsStore()

  const stores = computed(() => {
    const storeSet = new Set(
      spendingsStore.spendings
        .map((s: Spending) => s.store)
        .filter((s): s is string => s != null && s !== ''),
    )
    return [...storeSet].sort()
  })

  const allTags = computed(() => {
    const tagSet = new Set<string>()
    spendingsStore.spendings.forEach((s: Spending) => {
      if (s.tags && s.tags.length > 0) {
        s.tags.forEach((tag: string) => tagSet.add(tag))
      }
    })
    return [...tagSet].sort()
  })

  // Memoized maps that only recalculate when spendingsStore.spendings changes
  const spendingsByCategory = computed(() => {
    const map = new Map<string, Spending[]>()
    spendingsStore.spendings.forEach((s: Spending) => {
      if (!map.has(s.category)) {
        map.set(s.category, [])
      }
      map.get(s.category)!.push(s)
    })
    return map
  })

  const spendingsByStore = computed(() => {
    const map = new Map<string, Spending[]>()
    spendingsStore.spendings.forEach((s: Spending) => {
      if (s.store) {
        if (!map.has(s.store)) {
          map.set(s.store, [])
        }
        map.get(s.store)!.push(s)
      }
    })
    return map
  })

  const spendingsByTag = computed(() => {
    const map = new Map<string, Spending[]>()
    spendingsStore.spendings.forEach((s: Spending) => {
      if (s.tags && s.tags.length > 0) {
        s.tags.forEach((tag: string) => {
          if (!map.has(tag)) {
            map.set(tag, [])
          }
          map.get(tag)!.push(s)
        })
      }
    })
    return map
  })

  const currentViewId = ref<number>(0)

  type View = {
    id: number
    label: string
    categories: string[]
    hiddenColumnKeys: string[]
    getSpendings: (categoryOrStoreOrTag: string) => Spending[]
  }

  const VIEWS = computed(() => [
    {
      id: 0,
      label: 'Vše v jedné tabulce',
      categories: ['Všechny výdaje'],
      hiddenColumnKeys: [],
      enableSorting: false,
      getSpendings: (_: string): Spending[] => getSortedSpendings(spendingsStore.spendings),
    },
    {
      id: 1,
      label: 'Dle kategorií',
      categories: spendingsStore.categories,
      hiddenColumnKeys: ['category'],
      enableSorting: true,
      getSpendings: (category: string): Spending[] =>
        getSortedSpendings(getSpendingsByCategory(category)),
    },
    {
      id: 2,
      label: 'Dle obchodů',
      categories: stores.value,
      hiddenColumnKeys: ['store'],
      enableSorting: true,
      getSpendings: (store: string): Spending[] => getSortedSpendings(getSpendingsByStore(store)),
    },
    {
      id: 3,
      label: 'Dle tagů',
      categories: allTags.value,
      hiddenColumnKeys: ['tags'],
      enableSorting: true,
      getSpendings: (tag: string): Spending[] => getSortedSpendings(getSpendingsByTag(tag)),
    },
  ])

  const currentView = computed(() => VIEWS.value.find((v) => v.id === currentViewId.value))

  const hideColumnSelectHeaders = SpendingsColumns.map((col) => ({
    label: col.title,
    value: String(col.key),
  }))

  const hiddenColumnKeys = ref<string[]>(
    SpendingsColumns.filter((col) => col.isHidden).map((col) => String(col.key)),
  )

  const columns = computed(() =>
    SpendingsColumns.filter((col) => !hiddenColumnKeys.value.includes(String(col.key))),
  )

  const getSpendingsByCategory = (category: string) => spendingsByCategory.value.get(category) || []
  const getSpendingsByStore = (store: string) => spendingsByStore.value.get(store) || []
  const getSpendingsByTag = (tag: string) => spendingsByTag.value.get(tag) || []

  const hideColumnsOnViewChange = (newView: View | undefined, oldView: View | undefined) => {
    hiddenColumnKeys.value = [
      ...hiddenColumnKeys.value.filter((key) => !oldView?.hiddenColumnKeys.includes(key)),
      ...(newView?.hiddenColumnKeys || []),
    ]
  }

  watch(
    currentView,
    (newView, oldView) => {
      hideColumnsOnViewChange(newView, oldView)
    },
    { immediate: true },
  )

  // Sorting state - two independent buttons with 3 states each
  type SortState = 'none' | 'asc' | 'desc'
  const nameSortState = ref<SortState>('asc') // Default to alphabetically ascending
  const priceSortState = ref<SortState>('none')

  const toggleNameSort = () => {
    if (nameSortState.value === 'none') {
      nameSortState.value = 'asc'
      priceSortState.value = 'none'
    } else if (nameSortState.value === 'asc') {
      nameSortState.value = 'desc'
      priceSortState.value = 'none'
    } else {
      nameSortState.value = 'none'
    }
  }

  const togglePriceSort = () => {
    if (priceSortState.value === 'none') {
      priceSortState.value = 'asc'
      nameSortState.value = 'none'
    } else if (priceSortState.value === 'asc') {
      priceSortState.value = 'desc'
      nameSortState.value = 'none'
    } else {
      priceSortState.value = 'none'
    }
  }

  const getSortedSpendings = (spendings: Spending[]): Spending[] => {
    const sorted = [...spendings]

    if (nameSortState.value !== 'none') {
      sorted.sort((a, b) => {
        const comparison = a.name.localeCompare(b.name, 'cs')
        return nameSortState.value === 'asc' ? comparison : -comparison
      })
    } else if (priceSortState.value !== 'none') {
      sorted.sort((a, b) => {
        const comparison = a.totalPrice - b.totalPrice
        return priceSortState.value === 'asc' ? comparison : -comparison
      })
    }

    return sorted
  }

  // Sort categories by name or total price
  const getSortedCategories = (categories: string[], view: View): string[] => {
    const sorted = [...categories]

    if (nameSortState.value !== 'none') {
      sorted.sort((a, b) => {
        const comparison = a.localeCompare(b, 'cs')
        return nameSortState.value === 'asc' ? comparison : -comparison
      })
    } else if (priceSortState.value !== 'none') {
      sorted.sort((a, b) => {
        const spendingsA = view.getSpendings(a)
        const spendingsB = view.getSpendings(b)
        const totalA = spendingsA.reduce((sum, s) => sum + s.totalPrice, 0)
        const totalB = spendingsB.reduce((sum, s) => sum + s.totalPrice, 0)
        const comparison = totalA - totalB
        return priceSortState.value === 'asc' ? comparison : -comparison
      })
    }

    return sorted
  }
</script>
<template>
  <hr class="my-8 border-blue" />
  <h1 class="font-bold text-2xl text-blue mb-6">Zobrazení tabulky nákupů</h1>

  <div class="flex items-end justify-between mb-4">
    <ButtonNavigation v-model:selected-id="currentViewId" :buttons="VIEWS" />
    <div class="flex items-end gap-2">
      <div class="">
        <div class="text-[14px] ms-2 font-semibold text-nowrap text-blue">Skryté sloupce</div>
        <n-select
          class="min-w-[140px] hideColumnsSelect"
          v-model:value="hiddenColumnKeys"
          placeholder="Skryté"
          multiple
          :options="hideColumnSelectHeaders"
          clearable
        />
      </div>
      <div v-if="currentView?.enableSorting">
        <div class="text-[14px] ms-2 font-semibold text-nowrap text-blue">Řazení</div>
        <div class="flex gap-2">
          <button
            @click="toggleNameSort"
            class="px-4 py-1.5 rounded border-2 transition-colors font-medium"
            :class="{
              'border-blue bg-blue text-white': nameSortState !== 'none',
              'border-gray-300 bg-white text-gray-700 hover:border-blue': nameSortState === 'none',
            }"
          >
            ABC
            <span v-if="nameSortState === 'asc'"> ↑</span>
            <span v-if="nameSortState === 'desc'"> ↓</span>
          </button>
          <button
            @click="togglePriceSort"
            class="px-4 py-1.5 rounded border-2 transition-colors font-medium"
            :class="{
              'border-blue bg-blue text-white': priceSortState !== 'none',
              'border-gray-300 bg-white text-gray-700 hover:border-blue': priceSortState === 'none',
            }"
          >
            Cena
            <span v-if="priceSortState === 'asc'"> ↑</span>
            <span v-if="priceSortState === 'desc'"> ↓</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <template v-for="view in VIEWS">
    <template v-if="currentView?.id === view.id">
      <SpendingsCategoryTable
        v-if="view.categories?.length > 0"
        v-for="category in getSortedCategories(view.categories || [], view)"
        :key="category"
        :category="category"
        :spendings="view.getSpendings(category)"
        :columns="columns"
        :isCollapsedDefault="view.id != 0"
      />
      <div v-else class="text-center text-blue py-8 text-xl">Nebyly nalezeny žádné záznamy</div>
    </template>
  </template>

  <!-- Deleted Spendings Section -->
  <div class="my-8">
    <DeletedSpendingsTable />
  </div>
</template>
<style scoped>
  :deep(.hideColumnsSelect .n-base-selection > div) {
    padding-top: 6px;
    padding-bottom: 4px;
  }
</style>
