<script setup lang="ts">
  import { EllipsisVertical } from '@vicons/ionicons5'
  import { NButton, NDropdown, NIcon } from 'naive-ui'

  import { useSpendingDataTableAction } from '@/composables/spending/useSpendingDataTableAction'
  import type { Spending } from '@/types/Spending'

  const { spending } = defineProps<{
    spending: Spending
  }>()

  const { dropdownOptions, handleActionSelect } = useSpendingDataTableAction()
</script>

<template>
  <div class="flex justify-end">
    <n-dropdown
      :options="dropdownOptions"
      trigger="click"
      placement="bottom-end"
      @select="(key: string) => handleActionSelect(key, spending)"
    >
      <n-button quaternary circle size="small" @click.stop>
        <template #icon>
          <n-icon><EllipsisVertical /></n-icon>
        </template>
      </n-button>
    </n-dropdown>
  </div>
</template>
