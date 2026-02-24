<script setup lang="ts">
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { NButton, useMessage } from 'naive-ui'

  import { useI18n } from 'vue-i18n'

  import { useSpendingDialogAction } from '@/composables/spending/useSpendingDialogAction'

  const { discardChangesDialog } = useSpendingDialogAction()
  const { t } = useI18n()
  const store = useSpendingsStore()
  const message = useMessage()

  async function handleSave(): Promise<void> {
    try {
      await store.save()
      message.success(t('messages.changesSavedSuccessfully'))
    } catch (error) {
      message.error(t('messages.errorSavingChanges'))
      console.error('Save error:', error)
    }
  }
</script>
<template>
  <div class="flex items-center animate-breathing">
    <div class="text-orange-600 font-semibold me-4">
      {{ $t('header.unsavedChanges') }}
    </div>
    <div class="flex items-center gap-2 me-10 bg-orange-200 p-2 px-3 shadow rounded-md">
      <n-button type="success" @click="handleSave">
        {{ $t('header.saveChanges') }}
      </n-button>
      <n-button type="error" @click="discardChangesDialog()">
        {{ $t('header.discardChanges') }}
      </n-button>
    </div>
  </div>
</template>
<style scoped>
  @keyframes breathing {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.9;
      transform: scale(0.98);
    }
  }

  .animate-breathing {
    animation: breathing 2s ease-in-out infinite;
  }
  .animate-breathing:hover {
    animation-play-state: paused;
  }
</style>
