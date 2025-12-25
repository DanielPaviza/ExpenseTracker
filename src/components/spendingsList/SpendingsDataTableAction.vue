<script setup lang="ts">
  import { NButton, NDropdown } from 'naive-ui'

  import { useSpendingDataTableAction } from '@/composables/useSpendingDataTableAction'
  import type { Spending } from '@/types/Spending'

  const { spending } = defineProps<{
    spending: Spending
  }>()

  const { actionOptions, handleActionSelect } = useSpendingDataTableAction(spending)
</script>

<template>
  <div class="px-2">
    <n-dropdown :options="actionOptions" @select="handleActionSelect($event)">
      <n-button @click.stop>
        <div class="flex flex-col items-center justify-center font-bold text-[16px]">
          <span class="h-2 -mt-4">.</span>
          <span class="h-2">.</span>
          <span class="h-2">.</span>
        </div>
      </n-button>
    </n-dropdown>
  </div>
</template>
