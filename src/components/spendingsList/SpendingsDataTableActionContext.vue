<script setup lang="ts">
  import { NDropdown } from 'naive-ui'

  import { nextTick, ref, watch } from 'vue'

  import { useSpendingDataTableAction } from '@/composables/spending/useSpendingDataTableAction'
  import type { Spending } from '@/types/Spending'

  const { spending, mouseEvent } = defineProps<{
    spending: Spending
    mouseEvent?: MouseEvent | null
  }>()

  const isOpen = ref<boolean>(false)
  const x = ref(0)
  const y = ref(0)
  const { dropdownOptions, handleActionSelect } = useSpendingDataTableAction()

  const openContextMenu = (event: MouseEvent): void => {
    event.preventDefault()
    isOpen.value = false
    nextTick().then(() => {
      isOpen.value = true
      x.value = event.clientX
      y.value = event.clientY
    })
  }

  watch(
    () => mouseEvent,
    () => {
      openContextMenu(mouseEvent as MouseEvent)
    },
  )
</script>

<template>
  <n-dropdown
    :options="dropdownOptions"
    trigger="manual"
    placement="bottom-start"
    :show="isOpen"
    :x="x"
    :y="y"
    :on-clickoutside="() => (isOpen = false)"
    @mouseleave="isOpen = false"
    @update:show="(v) => (isOpen = v)"
    @select="(key: string) => handleActionSelect(key, spending)"
  >
  </n-dropdown>
</template>
