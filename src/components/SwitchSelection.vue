<script setup lang="ts">
  import { defineEmits, defineProps, nextTick, onMounted, ref, watch } from 'vue'

  const { tabs, modelValue } = defineProps<{
    tabs: { name: string; text: string }[]
    modelValue: string
  }>()
  const emit = defineEmits(['update:modelValue'])

  const container = ref<HTMLElement | null>(null)
  const activeStyle = ref({ left: '0px', width: '0px' })

  function updateActiveStyle() {
    nextTick(() => {
      if (!container.value) return
      const idx = tabs.findIndex((t) => t.name === modelValue)
      if (idx === -1) return
      const btns = container.value.querySelectorAll('button')
      const btn = btns[idx] as HTMLElement
      if (btn) {
        activeStyle.value = {
          left: btn.offsetLeft + 'px',
          width: btn.offsetWidth + 'px',
        }
      }
    })
  }

  onMounted(updateActiveStyle)
  watch(() => modelValue, updateActiveStyle)
  watch(() => tabs, updateActiveStyle, { deep: true })
</script>
<template>
  <div>
    <div ref="container" class="relative flex w-full rounded bg-gray-100 overflow-hidden h-12">
      <div
        class="absolute top-0 left-0 h-full bg-blue-500 rounded transition-all duration-300 z-0"
        :style="activeStyle"
      ></div>
      <button
        v-for="tab in tabs"
        :key="tab.name"
        class="flex-1 py-2 rounded transition-colors duration-200 text-center font-semibold cursor-pointer relative z-10"
        :class="
          modelValue === tab.name
            ? 'text-white'
            : 'text-black hover:text-blue-600 bg-blue-100 hover:bg-blue-200'
        "
        @click="$emit('update:modelValue', tab.name)"
      >
        <span>{{ tab.text }}</span>
      </button>
    </div>
    <transition name="switch-fade-slide" mode="out-in">
      <div :key="modelValue" class="w-full">
        <slot :name="modelValue" />
      </div>
    </transition>
  </div>
</template>

<style scoped>
  .switch-fade-slide-enter-active,
  .switch-fade-slide-leave-active {
    transition:
      opacity 0.25s,
      transform 0.25s;
  }
  .switch-fade-slide-enter-from {
    opacity: 0;
    transform: translateX(30px);
  }
  .switch-fade-slide-leave-to {
    opacity: 0;
    transform: translateX(-30px);
  }
  .switch-fade-slide-enter-to,
  .switch-fade-slide-leave-from {
    opacity: 1;
    transform: translateX(0);
  }
</style>
