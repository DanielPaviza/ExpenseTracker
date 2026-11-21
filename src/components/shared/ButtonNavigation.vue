<script setup lang="ts">
  interface ButtonOption {
    id: number | string
    label: string
    selectedColor?: string
  }

  const { buttons, full } = defineProps<{
    buttons: ButtonOption[]
    full?: boolean
  }>()

  const selectedId = defineModel<number | string>('selectedId')

  const selectedTextColor: Record<string, string> = {
    red: 'text-danger',
    green: 'text-success',
    orange: 'text-warning',
    blue: 'text-primary',
  }
</script>

<template>
  <div
    class="inline-flex gap-0.5 rounded-xl border border-line bg-surface-3 p-1"
    :class="full ? 'flex w-full' : ''"
    role="tablist"
  >
    <button
      v-for="button in buttons"
      :key="button.id"
      type="button"
      role="tab"
      :aria-selected="selectedId === button.id"
      class="rounded-lg px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-150"
      :class="[
        full ? 'flex-1' : '',
        selectedId === button.id
          ? ['bg-surface shadow-card', selectedTextColor[button.selectedColor ?? 'blue']]
          : 'text-fg-muted hover:text-fg',
      ]"
      @click="selectedId = button.id"
    >
      {{ button.label }}
    </button>
  </div>
</template>
