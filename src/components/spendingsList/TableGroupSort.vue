<script setup lang="ts">
  import { watch } from 'vue'

  import { useTableGroupSort } from '@/composables/table/useTableGroupSort'
  import { type SortState, type SortType } from '@/types/TableGroupSort'

  const {
    sortState,
    sortType,
    isAscSort,
    isNameSort,
    isPriceSort,
    toggleNameSort,
    togglePriceSort,
  } = useTableGroupSort()

  const emit = defineEmits<{
    (e: 'update:sortState', value: SortState): void
    (e: 'update:sortType', value: SortType): void
  }>()

  watch(sortState, (newState) => {
    emit('update:sortState', newState)
  })
  watch(sortType, (newType) => {
    emit('update:sortType', newType)
  })
</script>
<template>
  <div class="">
    <div class="text-[14px] ms-2 font-semibold text-nowrap text-blue">
      {{ $t('table.sorting') }}
    </div>
    <div class="flex gap-2">
      <button
        class="px-4 py-1.5 rounded border-2 transition-colors font-medium"
        :class="{
          'border-blueLight ': isNameSort,
          'border-gray-300 bg-white text-gray-700 hover:border-blue': !isNameSort,
        }"
        @click="toggleNameSort"
      >
        ABC
        <span v-if="isNameSort && isAscSort"> ↑</span>
        <span v-if="isNameSort && !isAscSort"> ↓</span>
      </button>
      <button
        class="px-4 py-1.5 rounded border-2 transition-colors font-medium"
        :class="{
          'border-blueLight ': isPriceSort,
          'border-gray-300 bg-white text-gray-700 hover:border-blue': !isPriceSort,
        }"
        @click="togglePriceSort"
      >
        {{ $t('table.price') }}
        <span v-if="isPriceSort && isAscSort"> ↑</span>
        <span v-if="isPriceSort && !isAscSort"> ↓</span>
      </button>
    </div>
  </div>
</template>
