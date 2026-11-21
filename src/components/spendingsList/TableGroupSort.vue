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
  <div>
    <div class="mb-1 ms-1 text-xs font-medium text-fg-muted">
      {{ $t('table.sorting') }}
    </div>
    <div class="inline-flex gap-0.5 rounded-lg border border-line bg-surface-3 p-0.5">
      <button
        type="button"
        class="rounded-md px-3 py-1 text-sm font-medium transition"
        :class="isNameSort ? 'bg-surface text-primary shadow-card' : 'text-fg-muted hover:text-fg'"
        @click="toggleNameSort"
      >
        A–Z
        <span v-if="isNameSort">{{ isAscSort ? '↑' : '↓' }}</span>
      </button>
      <button
        type="button"
        class="rounded-md px-3 py-1 text-sm font-medium transition"
        :class="isPriceSort ? 'bg-surface text-primary shadow-card' : 'text-fg-muted hover:text-fg'"
        @click="togglePriceSort"
      >
        {{ $t('table.price') }}
        <span v-if="isPriceSort">{{ isAscSort ? '↑' : '↓' }}</span>
      </button>
    </div>
  </div>
</template>
