<script setup lang="ts">
  import { ChevronDownOutline } from '@vicons/ionicons5'
  import { NIcon } from 'naive-ui'

  import { formatCurrency } from '@/composables/useCurrencyFormat'

  const { title, totalPrice, totalCountSpendings } = defineProps<{
    title: string
    totalPrice: number
    totalCountSpendings: number
  }>()

  const emit = defineEmits<{
    (e: 'toggle-collapse'): void
  }>()

  function toggleCollapse(): void {
    emit('toggle-collapse')
  }
</script>

<template>
  <button
    type="button"
    class="card group flex w-full cursor-pointer items-center justify-between px-5 py-3 text-left transition hover:border-danger/40"
    @click="toggleCollapse"
  >
    <div class="flex items-center gap-3">
      <n-icon size="18" class="text-danger transition-transform group-hover:translate-y-0.5">
        <ChevronDownOutline />
      </n-icon>
      <span class="font-semibold text-fg">{{ title }}</span>
      <span class="rounded-md bg-danger/10 px-1.5 py-0.5 text-xs font-medium text-danger">
        {{ totalCountSpendings }}×
      </span>
    </div>
    <div class="font-semibold tabular-nums text-fg">{{ formatCurrency(totalPrice) }}</div>
  </button>
</template>
