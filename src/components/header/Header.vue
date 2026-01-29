<script setup lang="ts">
  import MarginContainer from '@components/shared/MarginContainer.vue'
  import { useSpendingsStore } from '@stores/spendingsStore'
  import { AddOutline, SettingsOutline } from '@vicons/ionicons5'
  import { NButton, NIcon } from 'naive-ui'

  import { onBeforeUnmount, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'

  import CategorySelect from '@/components/header/components/CategorySelect.vue'
  import CategorySelectionPanel from '@/components/header/components/CategorySelectionPanel.vue'
  import PendingChanges from '@/components/header/components/PendingChanges.vue'
  import { formatCurrency } from '@/composables/useCurrencyFormat'

  const isDev = import.meta.env.DEV
  const store = useSpendingsStore()
  const router = useRouter()

  const isCategorySelectionOpen = ref(false)

  let previousBodyOverflow = ''

  //Handle scroll lock when category selection is open
  watch(isCategorySelectionOpen, (isOpen) => {
    if (isOpen) {
      previousBodyOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = previousBodyOverflow
    }
  })

  onBeforeUnmount(() => {
    document.body.style.overflow = previousBodyOverflow
  })

  function openNewSpendingForm(): void {
    router.push('/new')
  }

  function openSettings(): void {
    router.push('/settings')
  }

  function handleCategorySelect(category: string | null): void {
    store.categoryView = category
    isCategorySelectionOpen.value = false
  }
</script>
<template>
  <header
    class="z-50 flex flex-col border-b-2 pt-4 pb-4 border-blue bg-blueLightTransparent backdrop-blur-md"
    :class="{
      'fixed inset-0 h-screen overflow-hidden bg-white backdrop-blur-none': isCategorySelectionOpen,
      'sticky top-0 mb-8': !isCategorySelectionOpen,
    }"
  >
    <MarginContainer class="h-full flex flex-col min-h-0">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <h1 class="text-4xl font-extrabold tracking-tight text-blue me-5">
            {{ $t('header.title') }}
          </h1>
          <template v-if="!isCategorySelectionOpen">
            <div class="mt-2">
              <n-button type="primary" color="#3b82f6" @click="openNewSpendingForm">
                <n-icon size="32">
                  <AddOutline />
                </n-icon>
                <div class="font-bold">
                  {{ $t('header.addNewPurchase') }}
                </div>
              </n-button>
            </div>
            <h1 class="text-4xl text-red font-bold ms-10">
              {{ isDev ? 'TEST' : '' }}
            </h1>
          </template>
        </div>
        <div class="flex items-center gap-4">
          <PendingChanges v-if="store.pendingChanges" />
          <template v-if="!isCategorySelectionOpen">
            <div class="text-blue flex items-center font-semibold text-lg">
              {{ $t('header.totalExpenses') }}: {{ formatCurrency(store.totalPrice) }}
            </div>
          </template>
          <n-button color="#3b82f6" @click="openSettings">
            <n-icon size="24">
              <SettingsOutline />
            </n-icon>
          </n-button>
        </div>
      </div>
      <CategorySelect v-model:is-open="isCategorySelectionOpen" />
      <!-- Category Selection Panel with animation -->
      <transition name="expand-down">
        <div v-if="isCategorySelectionOpen" class="mt-5 flex-1 min-h-0 overflow-hidden">
          <CategorySelectionPanel
            @select="handleCategorySelect"
            @close="isCategorySelectionOpen = false"
          />
        </div>
      </transition>
    </MarginContainer>
  </header>
</template>
<style scoped>
  @keyframes breathing {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.9;
      transform: scale(0.98);
    }
  }

  .animate-breathing {
    animation: breathing 2s ease-in-out infinite;
  }
  .animate-breathing:hover {
    animation-play-state: paused;
  }

  .expand-down-enter-active,
  .expand-down-leave-active {
    transition:
      transform 180ms ease,
      opacity 180ms ease;
    transform-origin: top;
    will-change: transform, opacity;
  }

  .expand-down-enter-from,
  .expand-down-leave-to {
    transform: translateY(-6px) scaleY(0.98);
    opacity: 0;
  }

  .expand-down-enter-to,
  .expand-down-leave-from {
    transform: translateY(0) scaleY(1);
    opacity: 1;
  }
</style>
