<script setup lang="ts">
  const { buttons } = defineProps<{
    buttons: { id: number; label: string }[]
  }>()

  const selectedId = defineModel<number>('selectedId', { default: 0 })
</script>

<template>
  <div class="flex justify-center mb-4">
    <button
      v-for="button in buttons"
      :key="button.id"
      :class="['nav-button', { active: selectedId === button.id }]"
      @click="selectedId = button.id"
    >
      {{ button.label }}
    </button>
  </div>
</template>

<style scoped>
  .nav-button {
    padding: 6px 60px;
    background-color: rgba(166, 162, 182, 0.2);
    border: 2px solid rgba(166, 162, 182, 0.3);
    color: #a6a2b6;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .nav-button:first-child {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  .nav-button:last-child {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  .nav-button::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background-color: rgba(59, 130, 246, 0.1);
    transform: translate(-50%, -50%);
    transition:
      width 0.4s ease,
      height 0.4s ease;
  }

  .nav-button:hover::before {
    width: 300px;
    height: 300px;
  }

  .nav-button:hover {
    border-color: rgba(59, 130, 246, 0.5);
    color: #3b82f6;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  }

  .nav-button.active {
    background-color: rgba(59, 130, 246, 0.15);
    border-color: #3b82f6;
    color: #3b82f6;
    font-weight: 600;
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
  }

  .nav-button.active::before {
    width: 300px;
    height: 300px;
  }

  .nav-button:active {
    transform: translateY(0);
  }

  .nav-button > span {
    position: relative;
    z-index: 1;
  }
</style>
