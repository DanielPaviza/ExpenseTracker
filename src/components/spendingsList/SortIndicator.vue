<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    active: boolean
    direction: 'asc' | 'desc' | null
  }>()

  const emit = defineEmits<{
    (e: 'update:direction', value: 'asc' | 'desc' | null): void
  }>()

  function toggleSort(): void {
    if (props.direction === null) emit('update:direction', 'asc')
    else if (props.direction === 'asc') emit('update:direction', 'desc')
    else emit('update:direction', null)
  }

  defineExpose({ toggleSort })

  const iconData = computed(() => {
    if (props.direction === 'asc')
      return [{ points: '8,3 8,13' }, { points: '8,3 5,6' }, { points: '8,3 11,6' }]
    else if (props.direction === 'desc')
      return [{ points: '8,13 8,3' }, { points: '8,13 5,10' }, { points: '8,13 11,10' }]
    else
      return [
        { points: '8,3 8,13' },
        { points: '8,3 5,6' },
        { points: '8,3 11,6' },
        { points: '8,13 5,10' },
        { points: '8,13 11,10' },
      ]
  })
</script>
<template>
  <button
    class="sortIndicator inline-flex cursor-pointer items-center justify-center rounded border-0 bg-transparent p-0.5 transition-colors select-none focus:outline-none"
    :class="
      active && direction ? 'text-primary' : 'text-fg-subtle opacity-0 group-hover:opacity-100'
    "
    :aria-pressed="active ? 'true' : 'false'"
    :title="
      direction === 'asc'
        ? 'Seřadit sestupně'
        : direction === 'desc'
          ? 'Zrušit řazení'
          : 'Seřadit vzestupně'
    "
    tabindex="0"
    @click.stop="toggleSort"
  >
    <svg class="size-4" fill="none" viewBox="0 0 16 16">
      <g stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline v-for="(line, i) in iconData" :key="i" :points="line.points" />
      </g>
    </svg>
  </button>
</template>
