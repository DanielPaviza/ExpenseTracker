<script setup lang="ts">
  import { SaveOutline } from '@vicons/ionicons5'
  import { NButton, NIcon } from 'naive-ui'

  import { useI18n } from 'vue-i18n'

  const emit = defineEmits<{
    save: []
    cancel: []
  }>()

  const { t } = useI18n()
</script>

<template>
  <div class="flex justify-between w-full gap-3">
    <div class="flex gap-3">
      <n-button @click="emit('cancel')">
        {{ t('dialogs.cancel') }}
      </n-button>
    </div>
    <n-button color="#3b82f6" @click="emit('save')">
      <template #icon>
        <n-icon>
          <SaveOutline />
        </n-icon>
      </template>
      {{ t('form.saveSettings') }}
    </n-button>
  </div>
</template>
