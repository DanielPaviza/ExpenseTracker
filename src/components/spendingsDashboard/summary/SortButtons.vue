<script setup lang="ts">
  import type { SortType } from '@/composables/useEntityStats'

  interface SortOption {
    value: SortType
    label: string
  }

  const { options, modelValue } = defineProps<{
    options: SortOption[]
    modelValue: SortType
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: SortType]
  }>()
</script>

<template>
  <div class="mb-3 flex flex-wrap gap-1.5">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="rounded-full border px-2.5 py-0.5 text-xs font-medium transition"
      :class="
        modelValue === option.value
          ? 'border-primary/40 bg-primary-soft text-primary'
          : 'border-line text-fg-muted hover:border-line-strong hover:text-fg'
      "
      @click="emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
