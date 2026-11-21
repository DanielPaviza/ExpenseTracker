<script setup lang="ts">
  import { CheckmarkCircleOutline, ChevronDownOutline, FolderOpenOutline } from '@vicons/ionicons5'
  import { NIcon } from 'naive-ui'
  import { storeToRefs } from 'pinia'

  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  import PendingChanges from '@/components/header/components/PendingChanges.vue'
  import { formatCurrency } from '@/composables/useCurrencyFormat'
  import { useSpendingsStore } from '@/stores/spendingsStore'

  const emit = defineEmits<{ (e: 'open-category-picker'): void }>()

  const { t } = useI18n()
  const store = useSpendingsStore()
  const { categoryView, pendingChanges, totalPrice } = storeToRefs(store)

  const categoryLabel = computed(() => categoryView.value ?? t('common.allCategories'))
</script>

<template>
  <header
    class="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-line bg-surface/80 px-6 backdrop-blur-md xl:px-10"
  >
    <!-- Category scope switcher -->
    <button
      type="button"
      class="group flex min-w-0 items-center gap-3 rounded-xl border border-line bg-surface px-3 py-1.5 text-left shadow-card transition hover:border-primary/50 hover:bg-primary-soft"
      @click="emit('open-category-picker')"
    >
      <div
        class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary"
      >
        <n-icon size="17"><FolderOpenOutline /></n-icon>
      </div>
      <div class="min-w-0">
        <div class="text-[11px] font-medium uppercase tracking-wide text-fg-subtle">
          {{ t('header.selectedCategory') }}
        </div>
        <div class="max-w-[320px] truncate text-sm font-semibold text-fg">
          {{ categoryLabel }}
        </div>
      </div>
      <n-icon size="16" class="ms-2 text-fg-subtle transition group-hover:text-primary">
        <ChevronDownOutline />
      </n-icon>
      <span class="ms-1 hidden items-center gap-0.5 lg:inline-flex"
        ><span class="kbd">Ctrl</span><span class="kbd">K</span></span
      >
    </button>

    <div class="flex-1" />

    <!-- Save state -->
    <transition name="fade" mode="out-in">
      <PendingChanges v-if="pendingChanges" />
      <div v-else class="flex items-center gap-1.5 text-sm text-fg-subtle">
        <n-icon size="16" class="text-success"><CheckmarkCircleOutline /></n-icon>
        {{ t('header.allSaved') }}
      </div>
    </transition>

    <div class="h-8 w-px bg-line" />

    <!-- Total -->
    <div class="text-right">
      <div class="text-[11px] font-medium uppercase tracking-wide text-fg-subtle">
        {{ t('header.totalExpenses') }}
      </div>
      <div class="text-lg font-semibold leading-tight tabular-nums text-fg">
        {{ formatCurrency(totalPrice) }}
      </div>
    </div>
  </header>
</template>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.15s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
