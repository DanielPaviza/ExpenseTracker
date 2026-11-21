<script setup lang="ts">
  import { NModal } from 'naive-ui'

  import CategorySelectionPanel from '@/components/header/components/CategorySelectionPanel.vue'
  import { useSpendingsStore } from '@/stores/spendingsStore'

  const show = defineModel<boolean>('show', { required: true })
  const store = useSpendingsStore()

  function handleSelect(category: string | null): void {
    store.categoryView = category
    show.value = false
  }
</script>

<template>
  <n-modal v-model:show="show" transform-origin="center">
    <div
      class="card flex max-h-[85vh] w-[min(1200px,92vw)] flex-col overflow-hidden p-0 shadow-pop"
    >
      <CategorySelectionPanel @select="handleSelect" @close="show = false" />
    </div>
  </n-modal>
</template>
