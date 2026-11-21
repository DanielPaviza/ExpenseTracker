<script setup lang="ts">
  import { HelpOutline } from '@vicons/ionicons5'
  import { NIcon, NTooltip } from 'naive-ui'

  const {
    text,
    color = 'var(--fg-subtle)',
    small,
  } = defineProps<{
    text: string
    color?: string
    small?: boolean
  }>()
</script>
<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <div
        class="flex cursor-help items-center justify-center rounded-full border p-0.5"
        :class="small ? 'size-4' : 'size-5'"
        :style="{ borderColor: color }"
      >
        <n-icon :color="color">
          <HelpOutline />
        </n-icon>
      </div>
    </template>
    <div class="flex items-center">
      {{ text }}
      <div class="ms-2">
        <slot />
      </div>
    </div>
  </n-tooltip>
</template>
