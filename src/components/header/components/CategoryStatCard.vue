<script setup lang="ts">
  import { BuildOutline } from '@vicons/ionicons5'
  import { NIcon } from 'naive-ui'

  import { ref } from 'vue'

  import DonutChart from '@/components/header/components/DonutChart.vue'
  import BulkEditActionContext from '@/components/shared/BulkEditActionContext.vue'
  import { useAppNavigation } from '@/composables/useAppNavigation'
  import { BulkEdit } from '@/constants/bulkEdit'

  const actionContextMouseEvent = ref<MouseEvent | null>(null)
  const { openBulkEdit } = useAppNavigation()

  function handleContextMenu(event: MouseEvent): void {
    event.preventDefault()
    actionContextMouseEvent.value = event
  }

  const emit = defineEmits<{
    (e: 'click'): void
  }>()

  const {
    title,
    totalPriceText,
    count,
    purchasesLabel,
    monthlyAverageText,
    monthLabel,
    percent,
    color,
    selected,
    canBeEdited,
  } = defineProps<{
    title: string
    totalPriceText: string
    count: number
    purchasesLabel: string
    monthlyAverageText: string
    monthLabel: string
    percent: number
    color: string
    selected: boolean
    canBeEdited: boolean
  }>()

  const handleGotoEditCategory = (event: MouseEvent): void => {
    event.stopPropagation()
    if (!canBeEdited) return
    openBulkEdit(BulkEdit.category, title)
  }
</script>

<template>
  <div
    class="group relative flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-5 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-card"
    :class="
      selected
        ? 'border-primary bg-primary-soft ring-1 ring-primary'
        : 'border-line bg-surface hover:border-primary/40'
    "
    @click="emit('click')"
    @contextmenu="handleContextMenu"
  >
    <div class="min-w-0 flex-1">
      <div class="mb-2 flex items-center gap-2">
        <span class="size-2.5 shrink-0 rounded-full" :style="{ backgroundColor: color }" />
        <div class="truncate font-medium text-fg">{{ title }}</div>
      </div>
      <div class="text-xl font-semibold tabular-nums text-fg">{{ totalPriceText }}</div>
      <div class="mt-1 flex flex-wrap items-center gap-1 text-xs text-fg-muted">
        <span>{{ count }}× {{ purchasesLabel }}</span>
        <span class="text-fg-subtle">•</span>
        <span>{{ monthlyAverageText }}/{{ monthLabel }}</span>
      </div>
    </div>

    <div class="size-14 shrink-0">
      <DonutChart :percent="percent" :color="color" />
    </div>

    <button
      v-if="canBeEdited"
      type="button"
      class="absolute top-2 right-2 rounded-md p-1 text-fg-subtle opacity-0 transition group-hover:opacity-100 hover:bg-surface-3 hover:text-warning"
      @click="handleGotoEditCategory"
    >
      <n-icon size="15"><BuildOutline /></n-icon>
    </button>
  </div>
  <BulkEditActionContext
    v-if="canBeEdited"
    :mouse-event="actionContextMouseEvent"
    :on-edit="handleGotoEditCategory"
  />
</template>
