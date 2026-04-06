<script setup lang="ts">
  import { BuildOutline } from '@vicons/ionicons5'
  import { NIcon } from 'naive-ui'

  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  import DonutChart from '@/components/header/components/DonutChart.vue'
  import BulkEditActionContext from '@/components/shared/BulkEditActionContext.vue'
  import { BulkEdit } from '@/constants/bulkEdit'

  const actionContextMouseEvent = ref<MouseEvent | null>(null)
  const router = useRouter()

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
    const encodedTitle = encodeURIComponent(title)
    router.push({ path: `/bulkEdit/${BulkEdit.category}/${encodedTitle}` })
  }
</script>

<template>
  <div
    class="m-2 relative flex justify-between items-center p-6 bg-white rounded-xl cursor-pointer transition-all duration-200 border-blue hover:shadow-lg hover:-translate-y-0.5"
    :class="
      selected
        ? 'border-2 bg-linear-to-br from-blue-50 to-white shadow-lg'
        : 'boxShadowCustom border border-transparent hover:border-blue'
    "
    @click="emit('click')"
    @contextmenu="handleContextMenu"
  >
    <div v-if="canBeEdited" class="absolute bottom-2 left-6" @click="handleGotoEditCategory">
      <n-icon color="orange" size="16" class="opacity-50 hover:opacity-100">
        <BuildOutline />
      </n-icon>
    </div>
    <div class="flex-1 min-w-0">
      <div class="text-xl font-semibold text-blue-800 mb-3 truncate">
        {{ title }}
      </div>

      <div class="mb-5">
        <div class="text-xl font-bold text-slate-800 mb-1">
          {{ totalPriceText }}
        </div>
        <div class="text-xs text-slate-500 flex flex-wrap items-center gap-1">
          <span>{{ count }}× {{ purchasesLabel }}</span>
          <span class="text-slate-300">•</span>
          <span>{{ monthlyAverageText }}/{{ monthLabel }}</span>
        </div>
      </div>
    </div>

    <div class="w-14 h-14 ml-4 shrink-0">
      <DonutChart :percent="percent" :color="color" />
    </div>
  </div>
  <BulkEditActionContext
    v-if="canBeEdited"
    :mouse-event="actionContextMouseEvent"
    :on-edit="handleGotoEditCategory"
  />
</template>
<style lang="css" scoped>
  .boxShadowCustom {
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  }
</style>
