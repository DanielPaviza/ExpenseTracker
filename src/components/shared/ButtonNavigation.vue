<script setup lang="ts">
  const { buttons } = defineProps<{
    buttons: { id: number | string; label: string }[]
  }>()

  const selectedId = defineModel<number | string>('selectedId')
</script>

<template>
  <div class="flex justify-center">
    <button
      v-for="(button, idx) in buttons"
      :key="button.id"
      @click="selectedId = button.id"
      :class="[
        'relative overflow-hidden px-14 py-1.5 bg-gray-100 border-2 border-[rgba(166,162,182,0.3)] text-[#a6a2b6] text-sm font-medium cursor-pointer transition-all duration-300',
        idx === 0 ? 'rounded-l-lg' : '',
        idx === buttons.length - 1 ? 'rounded-r-lg' : '',
        selectedId === button.id
          ? 'bg-blue-100 border-blue-300 text-blue-400 font-semibold shadow-sm'
          : '',
        'hover:border-blue-400 hover:text-blue-500 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0',
      ]"
    >
      <span class="relative z-10">{{ button.label }}</span>
      <span
        class="absolute top-1/2 left-1/2 w-0 h-0 rounded-full bg-blue-200 opacity-10 pointer-events-none transition-all duration-400"
        :class="[selectedId === button.id || $el?.matches(':hover') ? 'w-[300px] h-[300px]' : '']"
        style="transform: translate(-50%, -50%)"
      ></span>
    </button>
  </div>
</template>
