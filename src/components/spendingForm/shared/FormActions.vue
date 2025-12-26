<script setup lang="ts">
  import { SaveOutline, TrashOutline } from '@vicons/ionicons5'
  import { NButton, NIcon } from 'naive-ui'

  import { useI18n } from 'vue-i18n'

  interface Props {
    isEditMode: boolean
  }

  defineProps<Props>()

  const emit = defineEmits<{
    save: []
    delete: []
    cancel: []
  }>()

  const { t } = useI18n()
</script>

<template>
  <div class="flex justify-between w-full gap-3">
    <div class="flex gap-3">
      <n-button color="#fa5a7d" @click="emit('cancel')">
        {{ t('dialogs.cancel') }}
      </n-button>
      <n-button v-if="isEditMode" color="#ef4444" @click="emit('delete')">
        <template #icon>
          <n-icon>
            <TrashOutline />
          </n-icon>
        </template>
        {{ t('dialogs.delete') }}
      </n-button>
    </div>
    <n-button color="#3b82f6" @click="emit('save')">
      <template #icon>
        <n-icon>
          <SaveOutline />
        </n-icon>
      </template>
      {{ isEditMode ? t('form.saveChangesButton') : t('form.createPurchaseButton') }}
    </n-button>
  </div>
</template>
