<script setup lang="ts">
  import Tooltip from '@components/shared/Tooltip.vue'
  import SortIndicator from '@components/spendingsList/SortIndicator.vue'

  import { onBeforeUpdate, ref } from 'vue'
  import type { ComponentPublicInstance } from 'vue'

  import type { SpendingColumn } from '@/types/SpendingColumn'

  const { columns, sortState, additionalColumnTitle } = defineProps<{
    columns: SpendingColumn[]
    sortState: { key: string | null; direction: 'asc' | 'desc' | null }
    additionalColumnTitle?: string
  }>()

  const emit = defineEmits<{
    (e: 'update:sort', key: string, direction: 'asc' | 'desc' | null): void
  }>()

  type SortIndicatorInstance = ComponentPublicInstance<{ toggleSort: () => void }>
  const sortIndicatorRefs = ref<(SortIndicatorInstance | null)[]>([])

  function setSortIndicatorRef(idx: number, el: Element | ComponentPublicInstance | null): void {
    if (el && typeof (el as SortIndicatorInstance).toggleSort === 'function')
      sortIndicatorRefs.value[idx] = el as SortIndicatorInstance
    else if (el === null) sortIndicatorRefs.value[idx] = null
  }

  onBeforeUpdate(() => {
    sortIndicatorRefs.value = []
  })

  function updateSort(key: string, direction: 'asc' | 'desc' | null): void {
    emit('update:sort', key, direction)
  }
</script>

<template>
  <thead class="sticky top-0 z-10">
    <tr class="bg-surface-2">
      <th
        v-for="(column, colIdx) in columns"
        :key="String(column.key)"
        class="group border-b border-line ps-4 pe-2 py-2.5 text-left text-xs font-semibold tracking-wide whitespace-nowrap uppercase transition-colors select-none"
        :class="[
          sortState.key === column.key ? 'text-primary' : 'text-fg-muted',
          column.sortFn ? 'cursor-pointer hover:text-fg' : '',
        ]"
        @click="column.sortFn && sortIndicatorRefs[colIdx]?.toggleSort()"
      >
        <span class="flex items-center justify-between gap-2">
          <span class="flex items-center gap-1.5">
            <span>{{ column.title }}</span>
            <Tooltip v-if="!!column.tooltip" :text="column.tooltip" small />
          </span>

          <SortIndicator
            v-if="column.sortFn"
            :ref="(el) => setSortIndicatorRef(colIdx, el)"
            :active="sortState.key === column.key"
            :direction="sortState.key === column.key ? sortState.direction : null"
            @update:direction="(dir) => updateSort(String(column.key), dir)"
          />
        </span>
      </th>
      <th
        v-if="additionalColumnTitle"
        class="border-b border-line ps-4 pe-2 py-2.5 text-left text-xs font-semibold tracking-wide whitespace-nowrap text-fg-muted uppercase"
      >
        {{ additionalColumnTitle }}
      </th>
      <th v-else class="w-12 border-b border-line" />
    </tr>
  </thead>
</template>
