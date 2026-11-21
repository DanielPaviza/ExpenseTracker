<script setup lang="ts">
  import { computed } from 'vue'

  const { percent = 0, color = '#3b82f6' } = defineProps<{
    percent?: number
    color?: string
  }>()

  const clampedPercent = computed(() => {
    const value = Number.isFinite(percent) ? percent : 0
    return Math.min(100, Math.max(0, Math.round(value)))
  })

  const dashArray = computed(() => `${clampedPercent.value}, 100`)
</script>

<template>
  <div class="relative size-full">
    <svg viewBox="0 0 36 36" class="size-full">
      <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--surface-3)" stroke-width="3.2" />
      <circle
        cx="18"
        cy="18"
        r="15.9"
        fill="none"
        :stroke="color"
        stroke-width="3.2"
        :stroke-dasharray="dashArray"
        stroke-linecap="round"
        transform="rotate(-90 18 18)"
        class="transition-all duration-300"
      />
    </svg>
    <div
      class="absolute inset-0 flex items-center justify-center text-[11px] font-semibold tabular-nums text-fg-muted"
    >
      {{ clampedPercent }}%
    </div>
  </div>
</template>
