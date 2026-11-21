<script setup lang="ts">
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { ArrowUndoOutline, SaveOutline } from '@vicons/ionicons5'
  import { NButton, NIcon, NTooltip, useMessage } from 'naive-ui'

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
  <div
    class="flex items-center gap-3 rounded-xl border border-warning/30 bg-warning/10 py-1 ps-3 pe-1"
  >
    <span class="relative flex size-2">
      <span
        class="absolute inline-flex size-full animate-ping rounded-full bg-warning opacity-60"
      />
      <span class="relative inline-flex size-2 rounded-full bg-warning" />
    </span>
    <span class="text-sm font-medium text-warning">{{ t('header.unsavedChanges') }}</span>
    <div class="flex items-center gap-1">
      <n-tooltip>
        <template #trigger>
          <n-button size="small" quaternary @click="discardChangesDialog()">
            <template #icon>
              <n-icon><ArrowUndoOutline /></n-icon>
            </template>
            {{ t('header.discardChanges') }}
          </n-button>
        </template>
        {{ t('dialogs.discardChangesTitle') }}
      </n-tooltip>
      <n-button size="small" type="primary" @click="handleSave">
        <template #icon>
          <n-icon><SaveOutline /></n-icon>
        </template>
        {{ t('header.saveChanges') }}
        <span class="ms-2 rounded bg-white/20 px-1 text-[10px] font-semibold">Ctrl S</span>
      </n-button>
    </div>
  </div>
</template>
