<script setup lang="ts">
  import { NTooltip } from 'naive-ui'

  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const { status } = defineProps<{
    status: 'new' | 'edited' | null
  }>()
</script>

<template>
  <div v-if="status" class="status-indicator">
    <n-tooltip>
      <template #trigger>
        <span
          class="block size-2.5 rounded-full ring-3 ring-surface"
          :class="status === 'new' ? 'bg-success' : 'bg-warning'"
        />
      </template>
      {{ status === 'new' ? t('table.newPurchase') : t('table.editedPurchase') }}
    </n-tooltip>
  </div>
</template>

<style scoped>
  .status-indicator {
    position: absolute;
    right: 56px;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
