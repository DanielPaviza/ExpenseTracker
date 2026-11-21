<script setup lang="ts">
  import { formatCurrency } from '@/composables/useCurrencyFormat'
  import type { EntityStat } from '@/composables/useEntityStats'

  const {
    stat,
    showPercent = true,
    showCount = true,
    extraInfo,
    color,
  } = defineProps<{
    stat: EntityStat
    showPercent?: boolean
    showCount?: boolean
    extraInfo?: string
    color?: string
  }>()
</script>

<template>
  <div class="group py-1.5">
    <div class="flex items-baseline justify-between gap-4">
      <div class="flex min-w-0 items-center gap-2">
        <span
          v-if="color"
          class="size-2 shrink-0 rounded-full"
          :style="{ backgroundColor: color }"
        />
        <span class="truncate font-medium text-fg" :title="stat.name">{{ stat.name }}</span>
      </div>
      <div class="flex shrink-0 items-baseline gap-2">
        <span class="text-xs whitespace-nowrap text-fg-subtle tabular-nums">
          <template v-if="showPercent && showCount"
            >{{ stat.percent }}% · {{ stat.count }}×</template
          >
          <template v-else-if="showPercent">{{ stat.percent }}%</template>
          <template v-else-if="showCount">{{ stat.count }}×</template>
          <template v-if="extraInfo"> {{ extraInfo }}</template>
        </span>
        <span class="font-semibold whitespace-nowrap tabular-nums text-fg">
          {{ formatCurrency(stat.price) }}
        </span>
      </div>
    </div>
    <div class="mt-1.5 h-1 overflow-hidden rounded-full bg-surface-3">
      <div
        class="h-full rounded-full transition-all duration-500"
        :style="{
          width: `${Math.max(stat.percent, 1)}%`,
          backgroundColor: color ?? 'var(--primary)',
        }"
      />
    </div>
  </div>
</template>
