<script setup lang="ts">
  import { NInput, NSelect } from 'naive-ui'

  import { useI18n } from 'vue-i18n'

  import type { SpendingColumn } from '@/types/SpendingColumn'

  const { t } = useI18n()

  const { columns, columnFilters, columnFilterOptions } = defineProps<{
    columns: SpendingColumn[]
    columnFilters: Record<string, string>
    columnFilterOptions: Record<string, Array<{ label: string; value: string }>>
  }>()

  const emit = defineEmits<{
    (e: 'update:filter', key: string, value: string): void
  }>()

  function updateFilter(key: string, value: string): void {
    emit('update:filter', key, value || '')
  }
</script>

<template>
  <tr class="bg-surface">
    <th
      v-for="column in columns"
      :key="`filter-${String(column.key)}`"
      class="border-b border-line font-normal"
    >
      <div v-if="column.filterEnabled" class="px-2 py-2">
        <n-select
          v-if="column.selectFilterEnabled"
          :value="columnFilters[String(column.key)] || null"
          :options="columnFilterOptions[String(column.key)] || []"
          :placeholder="t('table.filterPlaceholder')"
          filterable
          tag
          clearable
          size="small"
          :class="{ 'active-filter': columnFilters[String(column.key)] }"
          @update:value="(val) => updateFilter(String(column.key), val || '')"
        />
        <n-input
          v-else
          :value="columnFilters[String(column.key)] || ''"
          :placeholder="t('table.filterPlaceholder')"
          clearable
          size="small"
          :class="{ 'active-filter': columnFilters[String(column.key)] }"
          @update:value="(val) => updateFilter(String(column.key), val || '')"
        />
      </div>
    </th>
    <th class="border-b border-line" />
  </tr>
</template>

<style scoped>
  .active-filter :deep(.n-base-selection),
  .active-filter:deep(.n-input) {
    --n-border: 1px solid var(--primary) !important;
    background-color: var(--primary-soft);
  }
</style>
