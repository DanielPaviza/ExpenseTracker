<script setup lang="ts">
  import { defineEmits, defineProps, nextTick, onMounted, ref, watch } from 'vue'

  const { tabs, modelValue } = defineProps<{
    tabs: { name: string; text: string }[]
    modelValue: string
  }>()
  const emit = defineEmits(['update:modelValue'])

  const container = ref<HTMLElement | null>(null)
  const activeStyle = ref({ left: '0px', width: '0px' })

  // Track previous tab index for animation direction
  const prevTabIdx = ref<number | null>(null)
  const direction = ref<'left' | 'right'>('right')

  function updateActiveStyle() {
    nextTick(() => {
      if (!container.value) return
      const idx = tabs.findIndex((t) => t.name === modelValue)
      if (idx === -1) return
      // Determine direction for header animation
      if (prevTabIdx.value !== null) {
        direction.value = idx > prevTabIdx.value ? 'right' : 'left'
      }
      prevTabIdx.value = idx
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

  onMounted(() => {
    prevTabIdx.value = tabs.findIndex((t) => t.name === modelValue)
    updateActiveStyle()
  })
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
        class="flex-1 text-[18px] py-2 rounded transition-colors duration-200 text-center cursor-pointer relative z-10"
        :class="
          modelValue === tab.name
            ? 'text-white font-semibold cursor-default'
            : 'text-white font-semibold hover:text-blue-600 bg-blue-200 hover:bg-blue-300'
        "
        @click="$emit('update:modelValue', tab.name)"
      >
        <span>{{ tab.text }}</span>
      </button>
    </div>
    <!-- Secondary header below the buttons -->
    <hr class="my-8 border-blue-300" />
    <transition
      :name="direction === 'right' ? 'switch-header-slide-right' : 'switch-header-slide-left'"
      mode="out-in"
    >
      <h2
        :key="modelValue + '-header'"
        class="w-full mb-4 text-3xl font-extrabold text-blue tracking-tight switch-header-content"
      >
        {{ tabs.find((t) => t.name === modelValue)?.text }}
      </h2>
    </transition>
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
  /* Animation for the secondary header (h2) - slide right */
  .switch-header-slide-right-enter-active,
  .switch-header-slide-right-leave-active {
    transition:
      opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .switch-header-slide-right-enter-from {
    opacity: 0;
    transform: translateX(40px) scale(0.98);
  }
  .switch-header-slide-right-leave-to {
    opacity: 0;
    transform: translateX(-40px) scale(0.98);
  }
  .switch-header-slide-right-enter-to,
  .switch-header-slide-right-leave-from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }

  /* Animation for the secondary header (h2) - slide left */
  .switch-header-slide-left-enter-active,
  .switch-header-slide-left-leave-active {
    transition:
      opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .switch-header-slide-left-enter-from {
    opacity: 0;
    transform: translateX(-40px) scale(0.98);
  }
  .switch-header-slide-left-leave-to {
    opacity: 0;
    transform: translateX(40px) scale(0.98);
  }
  .switch-header-slide-left-enter-to,
  .switch-header-slide-left-leave-from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }

  .switch-header-content {
    will-change: opacity, transform;
  }
</style>
