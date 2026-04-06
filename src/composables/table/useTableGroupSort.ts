import { computed, ref } from 'vue'

import { DEFAULT_TABLE_GROUP_SORT } from '@/constants/defaultTableGroupSort'
import { SortState, SortType } from '@/types/TableGroupSort'

export function useTableGroupSort() {
  const sortType = ref<SortType>(DEFAULT_TABLE_GROUP_SORT.sortType)
  const sortState = ref<SortState>(DEFAULT_TABLE_GROUP_SORT.sortState)

  const toggleNameSort = (): void => {
    if (sortType.value === 'price') {
      sortType.value = 'abc'
      sortState.value = 'asc'
    } else if (sortState.value === 'asc') sortState.value = 'desc'
    else sortState.value = 'asc'
  }

  const togglePriceSort = (): void => {
    if (sortType.value === 'abc') {
      sortType.value = 'price'
      sortState.value = 'asc'
    } else if (sortState.value === 'asc') sortState.value = 'desc'
    else sortState.value = 'asc'
  }

  const isPriceSort = computed(() => sortType.value === 'price')
  const isNameSort = computed(() => sortType.value === 'abc')
  const isAscSort = computed(() => sortState.value === 'asc')

  return {
    isAscSort,
    isNameSort,
    isPriceSort,
    sortState,
    sortType,
    toggleNameSort,
    togglePriceSort,
  }
}
