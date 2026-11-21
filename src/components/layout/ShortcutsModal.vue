<script setup lang="ts">
  import { NModal } from 'naive-ui'

  import { useI18n } from 'vue-i18n'

  import { SHORTCUTS } from '@/composables/useKeyboardShortcuts'

  const show = defineModel<boolean>('show', { required: true })
  const { t } = useI18n()
</script>

<template>
  <n-modal
    v-model:show="show"
    preset="card"
    :title="t('shortcuts.title')"
    class="max-w-md"
    :bordered="false"
  >
    <ul class="divide-y divide-line">
      <li
        v-for="shortcut in SHORTCUTS"
        :key="shortcut.labelKey"
        class="flex items-center justify-between py-2.5 text-sm"
      >
        <span class="text-fg-muted">{{ t(shortcut.labelKey) }}</span>
        <span class="flex items-center gap-1">
          <span v-for="key in shortcut.keys" :key="key" class="kbd">{{ key }}</span>
        </span>
      </li>
    </ul>
  </n-modal>
</template>
